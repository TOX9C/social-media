const { PrismaClient } = require("../generated/prisma");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const usernames = [
  "alex_tech", "sarah_dev", "mike_codes", "emma_ui", "john_designer",
  "lisa_creative", "david_web", "olivia_js", "ryan_fullstack", "sophia_react",
  "james_backend", "ava_frontend", "daniel_nodejs", "mia_mobile", "chris_devops"
];

const postContents = [
  "Just finished a great project! 🚀 So excited to share it with everyone.",
  "Beautiful sunset today! Nature never fails to amaze me 🌅",
  "Coffee and coding - the perfect combination ☕💻",
  "Working on something awesome. Stay tuned! ✨",
  "Finally solved that bug that's been bothering me for days! 🎉",
  "Learning something new every day. Growth mindset! 📚",
  "Who else is excited for the weekend? 🎊",
  "Just deployed to production! Feeling accomplished 💪",
  "Taking a break from screens. Mental health matters! 🧘",
  "Collaboration makes everything better. Great team meeting today! 🤝",
  "The best code is code that doesn't need comments to understand.",
  "Remember to commit your code before leaving for the day! 😅",
  "Testing in production? Living on the edge! 😎",
  "Documentation is love. Documentation is life. 📝",
  "Another day, another merge conflict resolved ⚔️",
  "Refactoring old code and it feels so good! 🔧",
  "Just discovered an amazing new library! Game changer 🎮",
  "Stack Overflow saved my life again today 🙏",
  "Clean code is happy code! Keep it simple 🧹",
  "Debugging: being a detective in a crime movie where you're also the murderer 🔍",
  "That feeling when all tests pass on the first try ✅",
  "Late night coding session. When inspiration strikes! 🌙",
  "Remember to take breaks. Your eyes will thank you! 👀",
  "Just learned a cool new trick in JavaScript! Mind blown 🤯",
  "Code review time! Let's make this better together 👥"
];

const commentTexts = [
  "Great post! 👏",
  "Love this! 💙",
  "So true!",
  "Thanks for sharing!",
  "Awesome work!",
  "This is amazing!",
  "Couldn't agree more!",
  "Inspiring! ✨",
  "Keep it up! 🚀",
  "Well said!",
  "Absolutely! 💯",
  "This made my day!",
  "Love your content!",
  "So relatable 😄",
  "Interesting perspective!",
  "Thanks for the insight!",
  "You're killing it! 🔥",
  "Can't wait to see more!",
  "This is gold! ⭐",
  "Spot on!"
];

const messageTexts = [
  "Hey! How are you doing?",
  "Thanks for your help earlier!",
  "Did you see the latest update?",
  "Let's catch up soon!",
  "Great job on that project!",
  "Can you help me with something?",
  "What do you think about this?",
  "I saw your post, it was amazing!",
  "We should collaborate sometime!",
  "Hope you're having a great day!",
  "Thanks for connecting!",
  "Your work is inspiring!",
  "Let me know if you need anything!",
  "I'd love to hear your thoughts on this.",
  "Keep up the awesome work!"
];

async function clearDatabase() {
  console.log("🗑️  Clearing database...");
  
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  
  console.log("✅ Database cleared!");
}

async function seedUsers() {
  console.log("👥 Creating users...");
  
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt);
  
  const users = [];
  for (const username of usernames) {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        pfpUrl: null,
        pfpPath: null
      }
    });
    users.push(user);
  }
  
  console.log(`✅ Created ${users.length} users`);
  return users;
}

async function seedFollows(users) {
  console.log("🤝 Creating follow relationships...");
  
  let followCount = 0;
  
  for (let i = 0; i < users.length; i++) {
    const numFollows = Math.floor(Math.random() * 8) + 3;
    const followedIndices = new Set();
    
    for (let j = 0; j < numFollows; j++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * users.length);
      } while (randomIndex === i || followedIndices.has(randomIndex));
      
      followedIndices.add(randomIndex);
      
      const status = Math.random() > 0.2 ? "ACCEPTED" : Math.random() > 0.5 ? "PENDING" : "REJECTED";
      
      await prisma.follow.create({
        data: {
          followerId: users[i].id,
          followingId: users[randomIndex].id,
          status
        }
      });
      
      followCount++;
    }
  }
  
  console.log(`✅ Created ${followCount} follow relationships`);
}

async function seedPosts(users) {
  console.log("📝 Creating posts...");
  
  const posts = [];
  
  for (const user of users) {
    const numPosts = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numPosts; i++) {
      const randomContent = postContents[Math.floor(Math.random() * postContents.length)];
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      
      const post = await prisma.post.create({
        data: {
          content: randomContent,
          userId: user.id,
          created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000)
        }
      });
      
      posts.push(post);
    }
  }
  
  console.log(`✅ Created ${posts.length} posts`);
  return posts;
}

async function seedComments(users, posts) {
  console.log("💬 Creating comments...");
  
  let commentCount = 0;
  
  for (const post of posts) {
    const numComments = Math.floor(Math.random() * 8);
    
    for (let i = 0; i < numComments; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomComment = commentTexts[Math.floor(Math.random() * commentTexts.length)];
      const minutesAfterPost = Math.floor(Math.random() * 10000);
      
      await prisma.comment.create({
        data: {
          content: randomComment,
          userId: randomUser.id,
          postId: post.id,
          created_at: new Date(post.created_at.getTime() + minutesAfterPost * 60 * 1000)
        }
      });
      
      commentCount++;
    }
  }
  
  console.log(`✅ Created ${commentCount} comments`);
}

async function seedLikes(users, posts) {
  console.log("❤️  Creating likes...");
  
  let likeCount = 0;
  
  for (const post of posts) {
    const numLikes = Math.floor(Math.random() * 12);
    const likedByUsers = new Set();
    
    for (let i = 0; i < numLikes; i++) {
      let randomUser;
      do {
        randomUser = users[Math.floor(Math.random() * users.length)];
      } while (likedByUsers.has(randomUser.id));
      
      likedByUsers.add(randomUser.id);
      
      await prisma.like.create({
        data: {
          userId: randomUser.id,
          postId: post.id
        }
      });
      
      likeCount++;
    }
  }
  
  console.log(`✅ Created ${likeCount} likes`);
}

async function seedMessages(users) {
  console.log("✉️  Creating messages...");
  
  let messageCount = 0;
  
  const acceptedFollows = await prisma.follow.findMany({
    where: { status: "ACCEPTED" }
  });
  
  for (const follow of acceptedFollows) {
    if (Math.random() > 0.5) {
      const numMessages = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < numMessages; i++) {
        const isFromFollower = Math.random() > 0.5;
        const randomMessage = messageTexts[Math.floor(Math.random() * messageTexts.length)];
        const daysAgo = Math.floor(Math.random() * 15);
        const hoursAgo = Math.floor(Math.random() * 24);
        
        await prisma.message.create({
          data: {
            content: randomMessage,
            senderId: isFromFollower ? follow.followerId : follow.followingId,
            receiverId: isFromFollower ? follow.followingId : follow.followerId,
            created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000)
          }
        });
        
        messageCount++;
      }
    }
  }
  
  console.log(`✅ Created ${messageCount} messages`);
}

async function seedNotifications(users, posts) {
  console.log("🔔 Creating notifications...");
  
  let notificationCount = 0;
  
  const likes = await prisma.like.findMany({
    include: { Post: true }
  });
  
  for (const like of likes) {
    if (like.Post && like.Post.userId !== like.userId && Math.random() > 0.3) {
      await prisma.notification.create({
        data: {
          type: "LIKE",
          userId: like.Post.userId,
          triggerById: like.userId,
          postId: like.postId
        }
      });
      notificationCount++;
    }
  }
  
  const comments = await prisma.comment.findMany({
    include: { Post: true }
  });
  
  for (const comment of comments) {
    if (comment.Post && comment.Post.userId !== comment.userId && Math.random() > 0.3) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          userId: comment.Post.userId,
          triggerById: comment.userId,
          postId: comment.postId,
          commentId: comment.id
        }
      });
      notificationCount++;
    }
  }
  
  const follows = await prisma.follow.findMany();
  
  for (const follow of follows) {
    if (Math.random() > 0.5) {
      let type;
      if (follow.status === "PENDING") {
        type = "REQUEST_FOLLOW";
      } else if (follow.status === "ACCEPTED") {
        type = "REQUEST_ACCEPT";
      } else {
        continue;
      }
      
      await prisma.notification.create({
        data: {
          type,
          userId: follow.followingId,
          triggerById: follow.followerId
        }
      });
      notificationCount++;
    }
  }
  
  console.log(`✅ Created ${notificationCount} notifications`);
}

async function main() {
  console.log("🌱 Starting database seed...\n");
  
  await clearDatabase();
  const users = await seedUsers();
  await seedFollows(users);
  const posts = await seedPosts(users);
  await seedComments(users, posts);
  await seedLikes(users, posts);
  await seedMessages(users);
  await seedNotifications(users, posts);
  
  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📊 Summary:");
  console.log(`   Users: ${users.length}`);
  console.log(`   Posts: ${posts.length}`);
  console.log("   Default password for all users: password123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
