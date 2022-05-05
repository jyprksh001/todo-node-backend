import {ExpressServer,MongoServer} from "./server/index.js";

const main = async()=>{
    try {
      await MongoServer;
      await ExpressServer;
    } catch (err) {
      console.error(`Couldn't start`, err);
      process.exit(1);
    }
}

main()





