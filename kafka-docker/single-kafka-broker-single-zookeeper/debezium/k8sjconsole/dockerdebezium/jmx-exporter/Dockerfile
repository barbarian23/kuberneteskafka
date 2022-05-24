ARG DEBEZIUM_VERSION
FROM quay.io/debezium/connect:1.9

ARG JMX_AGENT_VERSION
RUN mkdir /kafka/etc && cd /kafka/etc &&\
        curl -so jmx_prometheus_javaagent.jar \
        https://repo1.maven.org/maven2/io/prometheus/jmx/jmx_prometheus_javaagent/$JMX_AGENT_VERSION/jmx_prometheus_javaagent-$JMX_AGENT_VERSION.jar

ADD bin /kafka/libs
ADD plugin /kafka/plugins/

COPY config.yml /kafka/etc/config.yml