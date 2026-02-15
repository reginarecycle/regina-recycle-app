import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {

constructor (private prisma: PrismaService) {}

async creditUser(userId: string, amount: number){
return this.prisma.wallet.update({
    where: {userId},
    data: {
        balance: {
            increment: amount,
        },
    },
});
}


}
