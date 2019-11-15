# base image
FROM node:10.16.3
# set working directory
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --slient
#RUN npm install findoutinfographic@0.1.0 -g --silent
# start app
#CMD ["react-scripts start"]
#RUN npm start
CMD ["npm", "start"]