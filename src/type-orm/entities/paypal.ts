import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./user";

@Entity()
export class Paypal extends BaseEntity {
    @PrimaryGeneratedColumn()
        id: number;

    @Column()
        username: string;

    @Column()
        accountName?: string;

    // @CreateDateColumn()
    //     createdAt: Date;

    @ManyToOne(() => User, (user) => user.paypal, { createForeignKeyConstraints: false })
        user: User;

    static async addPaypal(username: string, uId: number, accountName?: string): Promise<Paypal | null> {

        const result = await this.createQueryBuilder()
            .insert()
            .values([
                { username, accountName, user: { id: uId } }
            ])
            .execute();
                
        return await this.findOneBy({ id: result.identifiers[0].id });
    }
}
