import { MyContext } from "../types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2'
import { User } from "../entities/User";
import { EntityManager } from '@mikro-orm/postgresql'
import { COOKIE_NAME } from "../constants";

@InputType()
class UsernamePasswordInput {
  @Field()
  username!: string
  @Field()
  password!: string
}

@ObjectType()
class FieldError {
  @Field()
  field!: string
  @Field()
  message!: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}


@Resolver()
export class UserResolver {
  //REGISTER
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, em }: MyContext
  ) {
    // Not Logged In Condition
    if (!req.session.userId) {
      return null
    }

    // Give User if its logged in
    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }


  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {

    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    if (options.password.length <= 2) {
      return {
        errors: [{
          field: 'password',
          message: 'length must be greater than 2'
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password)

    let user

    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning("*")

      user = result[0]
    } catch (err) {
      // duplicate username error
      if (err.detail.includes("already exists")) {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }
    return { user }
  }

  //LOGIN RESOLVER
  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username })
    if (!user) {
      return {
        errors: [{
          field: "username",
          message: 'That username doesnt exist'
        }]
      }
    }
    const valid = await argon2.verify(user.password, options.password)
    if (!valid) {
      return {
        errors: [{
          field: "password",
          message: 'Incorrect password'
        }]
      }
    }

    // Store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id

    return {
      user
    }
  }

  // Log Out Resolver
  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    return new Promise(resolve => req.session.destroy(err => {
      res.clearCookie(COOKIE_NAME)
      if (err) {
        console.log(err)
        resolve(false)
        return
      }

      resolve(true)
    }))
  }
}
