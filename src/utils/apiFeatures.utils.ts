import { JwtService } from "@nestjs/jwt";

export default class ApiFeatures{
    static async assignJwtToken(
        userId: string,
        jwtservice: JwtService
    ): Promise<string>{
        const payload = {
            id: userId
        }
        const token = await jwtservice.sign(payload);
        return token;
    }
}