# Continous deployment script
cd ~/formatik/formatik-webtool/
git remote update

WEBTOOL_LOCAL=$(git rev-parse @)
WEBTOOL_REMOTE=$(git rev-parse @{u})
WEBTOOL_BASE=$(git merge-base @ @{u})

if [[ $WEBTOOL_LOCAL = $WEBTOOL_REMOTE && $1 != "force" ]]; then
    echo "Up-to-date"
elif [[ $WEBTOOL_LOCAL = $WEBTOOL_BASE || $1 == "force" ]]; then
    echo "Rebuilding..."
    
    git checkout -- package-lock.json
    git pull

    echo "Building Webtool..."
    docker run \
        --rm \
        -v ~/formatik/formatik-webtool:/var/formatik-webtool \
        -w /var/formatik-webtool \
        -c 512 \
        node:8.9.3 \
        /bin/bash -c "npm install; npm run build -- -prod --output-path dist"

    if [[ $? == "0" ]]; then           
        echo "...Build complete"

        find dist/. -type f ! -name '*.gz' -exec gzip "{}" -k -9 \;
    
        docker rmi octagon.formatik.webtool:old
        docker tag octagon.formatik.webtool:latest octagon.formatik.webtool:old
        docker build --tag=octagon.formatik.webtool:latest .

        echo "...image build complete"

        echo "Updating webtool service..."

        # For new swarms create service manually like this
        # docker service create \
        #     --network formatik_net \
        #     --replicas 1 \
        #     --constraint 'node.labels.webtool == true' \
        #     --name webtool \
        #     --hostname formatik-webtool \
        #     octagon.formatik.webtool:latest

        #docker run --rm -ti -p 8000:8000 --name webtool-test octagon.formatik.webtool:latest

        docker service update \
            --image octagon.formatik.webtool:latest \
            --force \
            webtool

        echo "...webtool service updated"

        curl -s --user 'api:key-0f66fb27e1d888d8d5cddaea7186b634' \
            https://api.mailgun.net/v3/sandboxf5c90e4cf7524486831c10e8d6475ebd.mailgun.org/messages \
                -F from='Formatik01 <postmaster@sandboxf5c90e4cf7524486831c10e8d6475ebd.mailgun.org>' \
                -F to='Bobby Kotzev <bobby@octagonsolutions.co>' \
                -F subject='Successfully updated Formatik WebTool' \
                -F text='...using latest source from master branch'
    else
        echo "...Tests Failed"

        curl -s --user 'api:key-0f66fb27e1d888d8d5cddaea7186b634' \
            https://api.mailgun.net/v3/sandboxf5c90e4cf7524486831c10e8d6475ebd.mailgun.org/messages \
                -F from='Formatik01 <postmaster@sandboxf5c90e4cf7524486831c10e8d6475ebd.mailgun.org>' \
                -F to='Bobby Kotzev <bobby@octagonsolutions.co>' \
                -F subject='Failed to update Formatik WebTool' \
                -F text='...latest source from master branch failed validation'
    fi                
fi

