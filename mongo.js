(async () => {
    const {
        MongoClient,
        ObjectId
    } = require('mongodb');
    // or as an es module:
    // import { MongoClient } from 'mongodb'

    // Connection URL
    const url = 'mongodb://18.141.196.195:27017';
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected successfully to server');
        const db = await client.db("sapomanager");
        const list = await db.collection('orders').aggregate([{
            $lookup: {
                from: "lineitems",
                localField: "id",
                foreignField: "order_id",
                as: "lineitems"
            }
        }, {
            $unwind: "$lineitems"
        }, {
            $match: {
                created_at: {
                    $lt: new Date("2022-04-28T00:00:00.000Z")
                }
            }
        }]);
        let index = 0;
        for await (const e of list) {
            await db.collection('lineitems').updateOne({
                id: e.lineitems.id,
                order_id: e.id
            }, {
                $set: {
                    machine_id: ObjectId('620f99dcaaa9bfb17fcceb25'),
                    status: "DONE"
                }
            });
            console.log("id", e.lineitems.id,"order_id",e.id, "created_at",e.created_at,"index",index);
            index++;
        }
        
        await db.collection('orders').updateMany(
                {created_at: {
                    $lt: new Date("2022-04-28T00:00:00.000Z")
                }}, {$set:{status:"DONE"}})

    } catch (e) {
        console.log("Error", e)
    }
})()