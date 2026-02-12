import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(data: Partial<User>): Promise<User> {
    return this.usersRepository.create(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }
    return user;
  }

  async findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.usersRepository.findByIdWithRefreshToken(id);
  }

  async findByVerificationToken(token: string): Promise<User> {
    const user = await this.usersRepository.findByVerificationToken(token);
    if (!user) {
      throw new NotFoundException('Doğrulama bağlantısı geçersiz.');
    }
    return user;
  }

  async markEmailVerified(userId: string): Promise<User> {
    const user = await this.usersRepository.markEmailVerified(userId);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }
    return user;
  }

  async deleteUnverifiedOlderThan(days: number): Promise<number> {
    return this.usersRepository.deleteUnverifiedOlderThan(days);
  }

  async updateVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date,
    sentAt: Date,
  ): Promise<User> {
    const user = await this.usersRepository.updateVerificationToken(
      userId,
      token,
      expiresAt,
      sentAt,
    );

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı.');
    }

    return user;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.findById(userId);
    await this.usersRepository.updatePassword(userId, hashedPassword);
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.findById(userId);
    await this.usersRepository.deleteAccount(userId);
  }

  async findBySlug(slug: string): Promise<User> {
    const user = await this.usersRepository.findBySlug(slug);
    if (!user) {
      throw new NotFoundException('Profil bulunamadı.');
    }
    return user;
  }

  async updateSlug(userId: string, slug: string | null): Promise<void> {
    await this.usersRepository.updateSlug(userId, slug);
  }

  async updateVisibilitySettings(
    userId: string,
    settings: Partial<User['visibilitySettings']>,
  ): Promise<void> {
    await this.usersRepository.updateVisibilitySettings(userId, settings);
  }

  async updateBio(userId: string, bio: string | null): Promise<void> {
    await this.usersRepository.updateBio(userId, bio);
  }

  async updateNotificationEmailEnabled(
    userId: string,
    enabled: boolean,
  ): Promise<void> {
    await this.usersRepository.updateNotificationEmailEnabled(userId, enabled);
  }

  async incrementShareCount(userId: string): Promise<number> {
    return this.usersRepository.incrementShareCount(userId);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.usersRepository.updateRefreshToken(userId, refreshToken);
  }
}
