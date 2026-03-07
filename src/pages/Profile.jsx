import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { studentAPI } from '../services/api';
import {
  UserCircleIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    education: '',
    skills: '',
    experience: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (user?.role === 'student') {
        const response = await studentAPI.updateProfile(dataToSend);
        updateUser(response.data.user || { ...user, ...dataToSend });
      }

      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
        <p className="text-gray-400">Manage your account information</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <UserCircleIcon className="inline h-5 w-5 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <EnvelopeIcon className="inline h-5 w-5 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <BriefcaseIcon className="inline h-5 w-5 mr-2" />
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {user?.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <AcademicCapIcon className="inline h-5 w-5 mr-2" />
                    Education
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="e.g., BS Computer Science, XYZ University"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <CodeBracketIcon className="inline h-5 w-5 mr-2" />
                    Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Python, JavaScript, React, Machine Learning"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your relevant experience..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Role</p>
                <p className="text-white capitalize">{user?.role}</p>
              </div>
            </div>

            {formData.phone && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Phone</p>
                <p className="text-white">{formData.phone}</p>
              </div>
            )}

            {formData.bio && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Bio</p>
                <p className="text-white">{formData.bio}</p>
              </div>
            )}

            {user?.role === 'student' && (
              <>
                {formData.education && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Education</p>
                    <p className="text-white">{formData.education}</p>
                  </div>
                )}

                {formData.skills && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.split(',').map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm border border-indigo-500/20"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.experience && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Experience</p>
                    <p className="text-white">{formData.experience}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
