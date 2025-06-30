import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome']
  },
  email: {
    type: String,
    required: [true, 'Por favor, informe o email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: async function(email: string) {
        if (!this.isModified('email')) return true;
        const user = await mongoose.models.User.findOne({ email, _id: { $ne: this._id } });
        return !user;
      },
      message: 'Email já está em uso'
    }
  },
  password: {
    type: String,
    required: [true, 'Por favor, informe a senha'],
    minlength: 6,
    select: false
  }
}, {
  timestamps: true
});

// Middleware para criptografar senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para verificar senha
userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User; 