import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

const Landing = () => {
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized internship matches based on your skills and preferences',
      gradient: 'from-indigo-500 to-violet-500',
    },
    {
      icon: ChartBarIcon,
      title: 'Smart Skill Matching',
      description: 'See exactly how your skills match with each opportunity',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'AI Career Chatbot',
      description: '24/7 career guidance and personalized advice from our AI assistant',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: BoltIcon,
      title: 'Live Updates',
      description: 'Access internships from LinkedIn, government schemes, and more',
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium">
              AI-Powered Platform
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
            AI-Powered Internship
            <br />
            Matching Platform
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Find your perfect internship match with our intelligent recommendation
            system. Get personalized suggestions, skill analysis, and career guidance
            all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-lg shadow-2xl shadow-indigo-500/50 transition-all"
              >
                Get Started Free
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 text-white font-semibold text-lg transition-all"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-block bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to find your dream internship?
            </h2>
            <p className="text-gray-400 mb-6">
              Join thousands of students already using SmartIntern Match Pro
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30"
              >
                Create Free Account
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400">
            2024 SmartIntern Match Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
