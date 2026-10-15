require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const MembershipPlan = require('../models/MembershipPlan');
const WorkoutProgram = require('../models/WorkoutProgram');
const Trainer = require('../models/Trainer');
const Membership = require('../models/Membership');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    MembershipPlan.deleteMany(),
    WorkoutProgram.deleteMany(),
    Trainer.deleteMany(),
    Membership.deleteMany()
  ]);
  console.log('🗑️  Cleared existing data');

  // ─── Users ───────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@1234', 12);
  const memberPassword = await bcrypt.hash('Member@1234', 12);

  const [admin, member1] = await User.insertMany([
    {
      name: 'Admin User',
      email: 'admin@fitzonepro.com',
      phone: '9999999999',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      height: 175,
      weight: 70,
      fitnessGoal: 'general_fitness'
    },
    {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '9876543210',
      password: memberPassword,
      role: 'member',
      isActive: true,
      height: 178,
      weight: 75,
      fitnessGoal: 'muscle_gain'
    },
    {
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '9123456789',
      password: memberPassword,
      role: 'member',
      isActive: true,
      height: 162,
      weight: 58,
      fitnessGoal: 'weight_loss'
    }
  ]);
  console.log('👤 Users seeded');

  // ─── Membership Plans ─────────────────────────────────────
  const [basicPlan, proPlan, elitePlan] = await MembershipPlan.insertMany([
    {
      name: 'Basic',
      price: 999,
      duration: 1,
      description: 'Perfect for beginners starting their fitness journey.',
      features: [
        'Access to gym floor',
        'Basic cardio equipment',
        'Locker room access',
        '2 group classes/month',
        'Fitness assessment'
      ],
      isPopular: false,
      isActive: true,
      color: '#6b7280'
    },
    {
      name: 'Pro',
      price: 1999,
      duration: 1,
      description: 'Most popular plan for serious fitness enthusiasts.',
      features: [
        'Full gym access',
        'All equipment',
        'Unlimited group classes',
        '2 personal training sessions',
        'Nutrition guidance',
        'Progress tracking',
        'Sauna & steam room'
      ],
      isPopular: true,
      isActive: true,
      color: '#84cc16'
    },
    {
      name: 'Elite',
      price: 2999,
      duration: 1,
      description: 'Premium membership with exclusive perks and dedicated trainer.',
      features: [
        'Everything in Pro',
        'Dedicated personal trainer',
        'Custom workout plan',
        'Custom diet plan',
        'Priority class booking',
        'Guest passes (2/month)',
        'Recovery room access',
        '24/7 gym access'
      ],
      isPopular: false,
      isActive: true,
      color: '#f59e0b'
    },
    {
      name: 'Annual Pro',
      price: 14999,
      duration: 12,
      description: 'Best value - Pro plan for a full year.',
      features: [
        'Everything in Pro',
        '2 months free',
        'Free fitness gear kit',
        'Body composition analysis'
      ],
      isPopular: false,
      isActive: true,
      color: '#8b5cf6'
    }
  ]);
  console.log('💳 Membership plans seeded');

  // ─── Active membership for demo member ────────────────────
  const membershipEnd = new Date();
  membershipEnd.setMonth(membershipEnd.getMonth() + 1);
  await Membership.create({
    user: member1._id,
    plan: proPlan._id,
    startDate: new Date(),
    endDate: membershipEnd,
    status: 'active',
    paymentStatus: 'demo',
    amountPaid: 1999,
    notes: 'Demo membership created by seed script.'
  });
  console.log('🏋️ Demo membership created');

  // ─── Workout Programs ────────────────────────────────────
  await WorkoutProgram.insertMany([
    {
      title: 'Strength Builder',
      description: 'Build serious strength with this progressive overload program. Focus on compound movements for maximum muscle and strength gains.',
      category: 'strength',
      difficulty: 'intermediate',
      duration: 60,
      daysPerWeek: 4,
      targetArea: ['Chest', 'Back', 'Shoulders', 'Legs'],
      calories: 400,
      exercises: [
        { name: 'Barbell Squat', sets: 4, reps: '6-8', restTime: '3 min' },
        { name: 'Deadlift', sets: 3, reps: '5', restTime: '3-4 min' },
        { name: 'Bench Press', sets: 4, reps: '6-8', restTime: '3 min' },
        { name: 'Overhead Press', sets: 3, reps: '8', restTime: '2 min' },
        { name: 'Barbell Row', sets: 4, reps: '8', restTime: '2 min' }
      ],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
      isActive: true
    },
    {
      title: 'Fat Burn HIIT',
      description: 'High-intensity interval training to maximize calorie burn and boost metabolism. Perfect for fat loss.',
      category: 'fat_loss',
      difficulty: 'intermediate',
      duration: 45,
      daysPerWeek: 3,
      targetArea: ['Full Body', 'Core', 'Legs'],
      calories: 600,
      exercises: [
        { name: 'Burpees', sets: 4, reps: '20 sec on / 10 sec off', restTime: '1 min between rounds' },
        { name: 'Jump Squats', sets: 4, reps: '20 sec on / 10 sec off' },
        { name: 'Mountain Climbers', sets: 4, reps: '30 sec' },
        { name: 'High Knees', sets: 4, reps: '30 sec' },
        { name: 'Box Jumps', sets: 3, reps: '12' }
      ],
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
      isActive: true
    },
    {
      title: 'Muscle Mass Program',
      description: 'Hypertrophy-focused program designed for maximum muscle growth using proven volume training methods.',
      category: 'muscle_building',
      difficulty: 'advanced',
      duration: 75,
      daysPerWeek: 5,
      targetArea: ['Chest', 'Arms', 'Back', 'Legs', 'Shoulders'],
      calories: 450,
      exercises: [
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12' },
        { name: 'Cable Flyes', sets: 3, reps: '12-15' },
        { name: 'Pull-Ups', sets: 4, reps: '8-10' },
        { name: 'Lat Pulldown', sets: 3, reps: '12' },
        { name: 'Bicep Curls', sets: 3, reps: '12-15' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15' }
      ],
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600',
      isActive: true
    },
    {
      title: 'Cardio Endurance',
      description: 'Build aerobic capacity and cardiovascular fitness with this structured cardio program.',
      category: 'cardio',
      difficulty: 'beginner',
      duration: 45,
      daysPerWeek: 4,
      targetArea: ['Heart', 'Lungs', 'Legs'],
      calories: 500,
      exercises: [
        { name: 'Warm-up Walk/Jog', duration: '5 min' },
        { name: 'Treadmill Running', duration: '20 min', reps: 'Steady pace 6-8 km/h' },
        { name: 'Cycling', duration: '15 min', reps: 'Moderate resistance' },
        { name: 'Rowing Machine', duration: '10 min' },
        { name: 'Cool-down Stretch', duration: '5 min' }
      ],
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600',
      isActive: true
    },
    {
      title: 'Beginner Fitness Bootcamp',
      description: 'Perfect starting point for beginners. Learn proper form, build base fitness and develop healthy gym habits.',
      category: 'beginner',
      difficulty: 'beginner',
      duration: 45,
      daysPerWeek: 3,
      targetArea: ['Full Body'],
      calories: 300,
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: '15' },
        { name: 'Push-Ups (Modified)', sets: 3, reps: '10' },
        { name: 'Dumbbell Rows', sets: 3, reps: '12' },
        { name: 'Plank Hold', sets: 3, reps: '20-30 sec' },
        { name: 'Lunges', sets: 3, reps: '10 each leg' }
      ],
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
      isActive: true
    },
    {
      title: 'Flexibility & Mobility',
      description: 'Improve flexibility, reduce injury risk, and enhance overall movement quality with this comprehensive mobility program.',
      category: 'flexibility',
      difficulty: 'beginner',
      duration: 40,
      daysPerWeek: 5,
      targetArea: ['Full Body', 'Joints', 'Spine'],
      calories: 150,
      exercises: [
        { name: 'Dynamic Warm-up', duration: '5 min' },
        { name: 'Hip Flexor Stretch', duration: '60 sec each side' },
        { name: 'Thoracic Spine Rotation', sets: 3, reps: '10 each side' },
        { name: 'Hamstring Stretch', duration: '60 sec each' },
        { name: 'Shoulder Mobility', duration: '5 min' },
        { name: 'Yoga Flow Sequence', duration: '15 min' }
      ],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
      isActive: true
    },
    {
      title: 'Functional Training',
      description: 'Train movements that matter in everyday life. Improve balance, coordination, and functional strength.',
      category: 'functional',
      difficulty: 'intermediate',
      duration: 50,
      daysPerWeek: 3,
      targetArea: ['Core', 'Full Body', 'Balance'],
      calories: 380,
      exercises: [
        { name: 'Kettlebell Swings', sets: 4, reps: '15' },
        { name: 'TRX Rows', sets: 3, reps: '12' },
        { name: 'Medicine Ball Slams', sets: 3, reps: '10' },
        { name: 'Battle Ropes', duration: '30 sec', sets: 4 },
        { name: 'Farmer\'s Carry', duration: '40 meters', sets: 3 }
      ],
      image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=600',
      isActive: true
    },
    {
      title: 'Weight Training Foundations',
      description: 'Master the fundamentals of weight training with proper technique, progressive programming, and smart recovery.',
      category: 'weight_training',
      difficulty: 'beginner',
      duration: 55,
      daysPerWeek: 3,
      targetArea: ['Full Body'],
      calories: 350,
      exercises: [
        { name: 'Goblet Squat', sets: 3, reps: '12' },
        { name: 'Dumbbell Chest Press', sets: 3, reps: '12' },
        { name: 'Seated Cable Row', sets: 3, reps: '12' },
        { name: 'Dumbbell Shoulder Press', sets: 3, reps: '12' },
        { name: 'Romanian Deadlift', sets: 3, reps: '12' }
      ],
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600',
      isActive: true
    }
  ]);
  console.log('💪 Workout programs seeded');

  // ─── Trainers ─────────────────────────────────────────────
  await Trainer.insertMany([
    {
      name: 'Arjun Mehta',
      specialization: 'Strength & Conditioning',
      experience: 8,
      bio: 'Former national-level powerlifter turned certified strength coach. Arjun has helped hundreds of clients build strength, confidence, and resilience. He specializes in evidence-based programming and injury prevention.',
      certifications: ['CSCS', 'CPT-NASM', 'SFG Level 2'],
      categories: ['Strength Training', 'Powerlifting', 'Athletic Performance'],
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      rating: 4.9,
      totalClients: 150,
      availableSlots: [
        { day: 'Monday', time: '6:00 AM', isBooked: false },
        { day: 'Monday', time: '8:00 AM', isBooked: false },
        { day: 'Wednesday', time: '6:00 AM', isBooked: false },
        { day: 'Friday', time: '7:00 AM', isBooked: false }
      ],
      isActive: true
    },
    {
      name: 'Sneha Kapoor',
      specialization: 'Weight Loss & HIIT',
      experience: 6,
      bio: 'Certified fitness trainer and nutrition coach specializing in sustainable fat loss. Sneha takes a holistic approach combining smart training, nutrition, and lifestyle changes for lasting results.',
      certifications: ['CPT-ACE', 'Precision Nutrition L1', 'TRX Certified'],
      categories: ['Fat Loss', 'HIIT', 'Nutrition Coaching', 'Women\'s Fitness'],
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
      rating: 4.8,
      totalClients: 120,
      availableSlots: [
        { day: 'Tuesday', time: '7:00 AM', isBooked: false },
        { day: 'Thursday', time: '7:00 AM', isBooked: false },
        { day: 'Saturday', time: '9:00 AM', isBooked: false }
      ],
      isActive: true
    },
    {
      name: 'Vikram Singh',
      specialization: 'Bodybuilding & Muscle Gain',
      experience: 10,
      bio: 'Professional bodybuilder and certified coach with over a decade of experience. Vikram has competed nationally and brings championship-level knowledge to help clients build their best physique.',
      certifications: ['ISSA Certified Trainer', 'Sports Nutrition Specialist', 'Advanced Bodybuilding Coach'],
      categories: ['Bodybuilding', 'Muscle Building', 'Competition Prep', 'Supplement Guidance'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      rating: 4.7,
      totalClients: 200,
      availableSlots: [
        { day: 'Monday', time: '5:00 PM', isBooked: false },
        { day: 'Wednesday', time: '5:00 PM', isBooked: false },
        { day: 'Friday', time: '5:00 PM', isBooked: false }
      ],
      isActive: true
    },
    {
      name: 'Ananya Gupta',
      specialization: 'Yoga & Flexibility',
      experience: 7,
      bio: 'Certified yoga instructor and mobility specialist. Ananya combines traditional yoga practices with modern sports science to improve flexibility, reduce stress, and enhance overall wellness.',
      certifications: ['RYT-500 Yoga Alliance', 'FRC Mobility Specialist', 'Meditation Teacher'],
      categories: ['Yoga', 'Flexibility', 'Mobility', 'Stress Management', 'Mindfulness'],
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400',
      rating: 4.9,
      totalClients: 90,
      availableSlots: [
        { day: 'Tuesday', time: '6:00 AM', isBooked: false },
        { day: 'Thursday', time: '6:00 AM', isBooked: false },
        { day: 'Sunday', time: '8:00 AM', isBooked: false }
      ],
      isActive: true
    },
    {
      name: 'Rohan Desai',
      specialization: 'Functional Fitness & Athletics',
      experience: 5,
      bio: 'Former college athlete and functional fitness coach. Rohan helps clients train for life — improving movement quality, building real-world strength, and developing athletic performance.',
      certifications: ['CFSC', 'CPT-NASM', 'Kettlebell Instructor Level 2'],
      categories: ['Functional Training', 'Athletic Performance', 'Sports Conditioning', 'Beginner Fitness'],
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      rating: 4.6,
      totalClients: 75,
      availableSlots: [
        { day: 'Monday', time: '10:00 AM', isBooked: false },
        { day: 'Wednesday', time: '10:00 AM', isBooked: false },
        { day: 'Saturday', time: '7:00 AM', isBooked: false }
      ],
      isActive: true
    }
  ]);
  console.log('🏃 Trainers seeded');

  console.log('\n✅ Database seeding complete!');
  console.log('\n📋 Demo Credentials:');
  console.log('   Admin: admin@fitzonepro.com / Admin@1234');
  console.log('   Member: rahul@example.com / Member@1234');
  console.log('   Member: priya@example.com / Member@1234');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
