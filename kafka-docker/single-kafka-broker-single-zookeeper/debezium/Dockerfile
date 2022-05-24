FROM quay.io/debezium/connect:1.9
ENV KAFKA_CONNECT_JDBC_DIR=$KAFKA_CONNECT_PLUGINS_DIR/kafka-connect-jdbc 

# Deploy MySQL JDBC Driver
ADD bin /kafka/libs

# Deploy Kafka Connect JDBC
#RUN mkdir $KAFKA_CONNECT_JDBC_DIR 
ADD plugin /kafka/connect

# Deploy Kafka connect
# RUN mkdir $KAFKA_CONNECT_JDBC_DIR 
# ADD /mysql/jdbc/. $KAFKA_CONNECT_JDBC_DIR 

# FROM node:latest

# WORKDIR /usr/index

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]