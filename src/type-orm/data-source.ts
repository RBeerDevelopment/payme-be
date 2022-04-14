import { DataSource } from "typeorm";
import { PaymentRequestEntity, PaypalEntity, SepaEntity, UserEntity } from "./entities";

export const dataSource = new DataSource({
    type: "sqlite",
    // host: "127.0.0.1",
    // username: "pqoa3vuj0558",
    // password: "pscale_pw_FJx55gggT72W6DjpijBTfCPWG9kczzLn95kHpd7xY28",
    database: "./db.sqlite3",
    // port: 3306,
    synchronize: true,
    logging: true,
    migrations: [__dirname + "./migration/*"],
    // ssl: true,
    entities: [UserEntity, PaymentRequestEntity, PaypalEntity, SepaEntity],
});