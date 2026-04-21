import { Target, Shield, Zap, Heart } from 'lucide-react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

const aboutPoints = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'Help individuals and families take control of their finances with simple, intuitive tools that make money management effortless.',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Your financial data is encrypted and protected. We prioritize your privacy and security above all else.',
  },
  {
    icon: Zap,
    title: 'Fast & Simple',
    description: 'No complicated setup. Start tracking your expenses in seconds with our clean, user-friendly interface.',
  },
]

function AboutSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About{' '}
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              ExpenseTracker
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We believe managing your money should be simple, insightful, and stress-free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {aboutPoints.map((point, index) => (
            <div
              key={point.title}
              className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 rounded-2xl flex items-center justify-center">
                  <point.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className={`${isVisible ? 'animate-fade-in-delay-2' : 'opacity-0'}`}
        >
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-center text-white">
            <Heart className="w-8 h-8 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Built with Purpose</h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              We're on a mission to make financial wellness accessible to everyone. Our goal is to empower you with the tools and insights you need to achieve your financial dreams.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection