"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getProfile(id) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
    async remove() {
        return 'I delete the user';
    }
    async register(userData) {
        try {
            const { name, email, password, phone } = userData;
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = this.userRepository.create({
                name,
                email,
                passwordHash: hashedPassword,
                phone,
            });
            await this.userRepository.save(newUser);
            const { passwordHash, ...safeUser } = newUser;
            return {
                message: 'User successfully registered to play!',
                user: safeUser
            };
        }
        catch (error) {
            console.error(error);
            if (error.code === '23505') {
                throw new common_1.ConflictException('This email is already registered in openGol. Try logging in!');
            }
            throw new common_1.InternalServerErrorException('An error occurred while registering the user');
        }
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email: email }
        });
    }
    async update(id, updateData) {
        const foundUser = await this.userRepository.findOneBy({ id });
        if (!foundUser) {
            throw new common_1.NotFoundException(`The player with ID ${id} does not exist`);
        }
        if (updateData.password) {
            const saltRounds = 10;
            foundUser.passwordHash = await bcrypt.hash(updateData.password, saltRounds);
            delete updateData.password;
        }
        const updatedUser = this.userRepository.merge(foundUser, updateData);
        await this.userRepository.save(updatedUser);
        const { passwordHash, ...safeUser } = updatedUser;
        return {
            message: 'Profile updated successfully!',
            user: safeUser,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map