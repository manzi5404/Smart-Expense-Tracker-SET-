import Modal from '../../common/Modal'
import Button from '../../common/Button'
import { X, Lightbulb } from 'lucide-react'

function AIInsightsModal({ insights, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">AI Insights</h2>
          <p className="text-gray-600">Personalized financial analysis</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-8">
        {insights?.length > 0 ? (
          insights.map((insight, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 rounded-2xl">
              <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
              <p className="text-gray-600">{insight.content}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Add transactions to unlock AI insights</p>
          </div>
        )}
      </div>
      
      <Button onClick={onClose} className="w-full">
        Close
      </Button>
    </Modal>
  )
}

export default AIInsightsModal

