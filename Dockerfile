FROM node:12-alpine 
# Create app directory
WORKDIR /home/kafka
RUN npm install
COPY . .
EXPOSE 3000 
CMD [ "npm", "start" ]