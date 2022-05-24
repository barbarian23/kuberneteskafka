FROM quay.io/debezium/connect:1.8
ENV KAFKA_CONNECT_JDBC_DIR=$KAFKA_CONNECT_PLUGINS_DIR/kafka-connect-jdbc 

# Deploy MySQL JDBC Driver
ADD bin /opt/kafka/libs

# Deploy Kafka Connect JDBC, MYSQL
RUN mkdir $KAFKA_CONNECT_JDBC_DIR 
ADD plugins $KAFKA_CONNECT_JDBC_DIR