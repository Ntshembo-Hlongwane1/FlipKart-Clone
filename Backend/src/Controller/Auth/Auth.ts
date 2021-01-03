import { Request, Response } from 'express';
import { IncomingForm, Fields } from 'formidable';
import { compare, hash, genSalt } from 'bcrypt';
import { userModel } from '../../Models/Users/User';
import { userSesionModel } from '../../Models/UserSessions/UserSession';

interface Auth {
  SignUp(request: Request, response: Response): Response;
  SignIn(request: Request, response: Response): Response;
  isLoggedIn(request: Request, response: Response): Promise<Response>;
}

class AuthController implements Auth {
  SignUp(request: Request, response: Response) {
    const form = new IncomingForm();

    try {
      form.parse(request, async (error, fields: Fields | any) => {
        if (error) {
          return response.status(500).json({ msg: 'Network Error: Failed to sign you up please try again later' });
        }

        const { username, password, verifiedPassword } = fields;

        if (!username || !password || !verifiedPassword) {
          return response.status(400).json({ msg: 'All fields are required' });
        }

        if (password.trim().length < 6) {
          return response.status(400).json({ msg: 'Password has to be at least 6 characters long' });
        }

        if (password.trim() !== verifiedPassword.trim()) {
          return response.status(400).json({ msg: "Password's do not match" });
        }

        const isUserExisting = await userModel.findOne({ username: username.trim() });

        if (isUserExisting) {
          return response.status(400).json({ msg: 'Account with this Username already exist' });
        }

        const salt = await genSalt(15);
        const hashedPassword = await hash(password.trim(), salt);

        const newUser = {
          username: username.trim(),
          password: hashedPassword
        };
        const user = new userModel(newUser);
        const savedUser = await user.save();

        return response.status(201).json({ msg: 'Account successfully created' });
      });
    } catch (error) {
      return response.status(500).json({ msg: 'Network Error: Failed to sign you up please try again later' });
    }
  }

  SignIn(request: Request, response: Response) {
    const form = new IncomingForm();

    try {
      form.parse(request, async (error, fields: Fields | any) => {
        if (error) {
          return response.status(500).json({ msg: 'Network Error: Failed to sign you in please try again later' });
        }

        const { username, password } = fields;

        if (!username || !password) {
          return response.status(400).json({ msg: 'All fields are required' });
        }

        const isUserExisting = await userModel.findOne({ username: username });

        if (!isUserExisting) {
          return response.status(404).json({ msg: 'Account with this username does not exist' });
        }

        const user: any = isUserExisting;
        const usersHashedPassword = user.password;

        const isPasswordValid = await compare(password.trim(), usersHashedPassword);

        if (!isPasswordValid) {
          return response.status(400).json({ msg: 'Invalid credentials' });
        }

        const isUserSessionActive = await userSesionModel.findOne({
          'session.user.username': user.username
        });
        if (isUserSessionActive) {
          return response.status(200).json({ msg: 'Account already logged in' });
        }
        const userSessionObj: object = {
          username: user.username,
          id: user._id
        };

        request.session.user = userSessionObj;
        return response.status(200).send(request.sessionID);
      });
    } catch (error) {
      return response.status(500).json({ msg: 'Network Error: Failed to sign you in please try again later' });
    }
  }

  async isLoggedIn(request: Request, response: Response) {
    const userSession = request.session.user || false;
    const username = userSession.username;
    try {
      if (userSession) {
        const user: any = await userModel.findOne({ username: username });
        const isUserASeller = user.isSeller;

        return response.status(200).json({ auth_status: true, isSeller: isUserASeller });
      }

      return response.status(200).json({ auth_status: false });
    } catch (error) {
      return response.status(500).json({ msg: 'Network Error: Failed to check user auth status' });
    }
  }
}

export { AuthController };
