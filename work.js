const master = (cluster) => {

    this.mycluster = cluster;
    const inside = {
        liftWorker: () => {
            let worker = this.cluster.fork();
            console.log(`The worker ${worker.id} is started.`);
        },
        liftWorkerError: () => {
            let worker = this;

            setTimeout(() => {
                worker.liftWorker();
            }, 200);
        }
    }
    return inside;
}

module.exports = master