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
    
    git pull

    # Restores need to be executed in every container. 
    # Restores from prior containers or the host are not valid inside a new container
    
    echo "Building Webtool..."
    docker run \
        --rm \
        -v ~/formatik/formatik-webtool:/var/formatik-webtool \
        -w /var/formatik-webtool \
        -c 512 \
        node:6.11.1 \
        /bin/bash -c "npm install; npm install -g typescript gulp; gulp client.build:dist"

    echo "...Build complete"
   
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
    #     --publish 8080:8000 \
    #     --name webtool \
    #     --hostname formatik-webtool \
    #     octagon.formatik.webtool:latest

    #docker run --rm -ti -p 8000:8000 --name webtool-test octagon.formatik.webtool:latest

    docker service update \
        --image octagon.formatik.webtool:latest \
        --force \
        webtool

    echo "...webtool service updated"

    curl -s --user 'webtool:key-0f66fb27e1d888d8d5cddaea7186b634' \
        https://webtool.mailgun.net/v3/sandboxf5c90e4cf7524486831c10e8d6475ebd.mailgun.org/messages \
            -F from='Formatik01 <postmaster@sandboxf5c90e4cf7524486831c10e8d6475ebd.mailgun.org>' \
            -F to='Bobby Kotzev <bobby@octagonsolutions.co>' \
            -F subject='Successfully updated Formatik Webtool' \
            -F text='...using latest source from master branch'
fi

