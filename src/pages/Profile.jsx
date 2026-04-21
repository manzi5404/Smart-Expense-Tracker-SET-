import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react'

function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  })

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please log in to view your profile.
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-32"></div>
        
        <div className="px-6 pb-6">
          <div className="relative -mt-16 mb-4">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-1">
              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 mt-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <User className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add phone number"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.phone || 'Not set'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Add location"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user.location || 'Not set'}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Save size={18} />
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    location: user.location || ''
                  })
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile