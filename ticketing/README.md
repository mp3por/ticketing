# Set Up

## Create JWT_KEY
Must create the JWT_KEY secret with the following command

https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19119820#notes

`kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asddas`

## Setup Ingress 
Get the installation instructions in the following link

https://kubernetes.github.io/ingress-nginx/deploy/#docker-desktop 

videos about ingress

107 - https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19102550#notes
108 - https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19102552#notes
220 - https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/23623120#notes

## Setup Skaffold

# Running

## Prerequisites:
1. modify `c:\windows\system32\drivers\etc\hosts` to include the following redirect `127.0.0.1 ticketing.dev`
2. install Skaffold, Docker, Kubenetes, Ingress-NGINX
3. add JWT_KEY secret

## Start
1. cd `./ticketing`
2. skaffold dev
3. go to `ticketing.dev`

## Making changes
### In the BE
Adding new pod https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19123188#notes
1. Create `package.json`, install deps
2. Write Dockerfile
3. Create `index.ts` to run project
4. Build image, push to docker hub
5. Write k8s file for deployment & service
6. Update skaffold.yaml to do file sync 
7. Write k8s file for Mongodb deployment & service

### In the FE

### In the CommonModule
repo - git@bitbucket.org:mp3por/microservices-udemy-common.git

## Testing
1. go to specific pod
2. run `npm test`

# KubeCTL cheatsheet - https://kubernetes.io/docs/reference/kubectl/cheatsheet/
* k get <ENTITY (pods/namespaces/secrets/)> - shows pods in DEFAULT namespace
