ARG PROMETHEUS_VERSION
FROM prom/prometheus:v2.26.0

RUN sed -i -e "s/'localhost:9090'/'localhost:9090','connect:8080', 'kafka:9092', 'zookeeper:2181'/" /etc/prometheus/prometheus.yml