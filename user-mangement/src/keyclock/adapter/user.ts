import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsString, ValidateNested } from "class-validator";






export class UserKeyclock {



    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsString()
    @IsEmail()
    email: string;



    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => credintalItemDto)
    credentials: credintalItemDto[];
    // End of class - closing bracket should be here


    constructor(email: string, credentials: credintalItemDto[]) {
        this.email = email;
        this.credentials = credentials;
    }


    getUserKeyclock() {
        return {
            email: this.email,
            credentials: this.credentials,
        };
    }


  
  }
  
  
  export class credintalItemDto {
    @ApiProperty({ example: 'password', description: 'User credentials type' })
    @IsString()
    @IsNotEmpty()
    type: string;
  
    @ApiProperty({ example: 'StrongPass123!', description: 'User credentials value' })
    @IsString()
    @IsNotEmpty()
    value: string;
  
    @ApiProperty({ example: false, description: 'User credentials temporary' })
    @IsBoolean()
    @IsNotEmpty()
    temporary: boolean;
  }