import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import User from "../models/user.js";

const uri =
  "mongodb+srv://sachingupta769:kfOXK9o2iukT1WZF@namastenode-dev.6ctfxf3.mongodb.net/Learning?retryWrites=true&w=majority&appName=NamasteNode-Dev";

  const seedUsers = async () => {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  
    const users = [];
  
    for (let i = 0; i < 100; i++) {
      const gender = faker.helpers.arrayElement(["male", "female", "other"]);
      const password = await bcrypt.hash("StrongPass123!", 10); // same password for all
  
      users.push({
        firstName: faker.person.firstName(gender),
        lastName: faker.person.lastName(),
        emailId: faker.internet.email(),
        password,
        age: faker.number.int({ min: 18, max: 60 }),
        gender,
        photoUrl: faker.image.avatar(),
        about: faker.lorem.sentence(),
        skills: faker.helpers.arrayElements(
          ["JavaScript", "Node.js", "React", "MongoDB", "Python", "AWS"],
          faker.number.int({ min: 1, max: 4 })
        ),
      });
    }
  
    await User.deleteMany(); // optional: clear old users
    await User.insertMany(users);
    console.log("✅ 100 users seeded");
  
    mongoose.disconnect();
  };

  seedUsers();