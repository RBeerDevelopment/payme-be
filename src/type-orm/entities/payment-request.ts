import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, BaseEntity } from "typeorm";
import { Currency } from "./currency";
import { User } from "./user";

@Entity()
export class PaymentRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        name: string;

    @Column()
        description?: string;

    @Column({ type: "float" })
        amount: number;

    // @Column({ type: "enum", enum: Currency, default: Currency.EUR })
    //     currency: Currency;

    @Column()
        currency: string;

    @Column()
        isPaid: boolean;

    // @CreateDateColumn()
    //     createdAt: Date;

    @ManyToOne(() => User, (user) => user.paymentRequests, { createForeignKeyConstraints: false })
        user: User;


    static async addPayment(name: string, amount: number, currency: string, uId: number, description?: string): Promise<PaymentRequest | null> {
        const result = await this.createQueryBuilder()
            .insert()
            .values([
                { name, amount, currency, isPaid: false, description, user: { id: uId } }
            ])
            .execute();
            
        return await this.findOneBy({ id: result.identifiers[0].id });
    }
}
