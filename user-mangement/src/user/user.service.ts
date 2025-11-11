import { Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { OutboxEvent, User } from './user.model';
import { Sequelize } from 'sequelize';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: typeof User,
        private readonly outboxRepository: typeof OutboxEvent,
        private readonly sequelize: Sequelize,
    ) {}

    async createUser(user: User): Promise<void> {
        await this.sequelize.transaction(async (transaction) => {

            try {
        const newUser = await this.userRepository.create(user, { transaction });


            await this.outboxRepository.create({
                eventType: 'USER_CREATED',
                payload: newUser.toJSON(),
                aggregateId: newUser.id,
            }, { transaction });
            return newUser;
        
        
        
        } catch (error) {
            throw new Error(error);
        }
    });
    }

    async getUserById(id: number): Promise<User> {
        return this.userRepository.findByPk(id);
    }

    async updateUser(user: User): Promise<[affectedCount: number]> {
        return this.userRepository.update(user, { where: { id: user.id } });
    }

    async deleteUser(id: number): Promise<number> {
        return this.userRepository.destroy({ where: { id: id } });
    }
}
