import { useState, useEffect } from 'react';
import { Trash2, Edit2, Save, X } from 'lucide-react';
import type { ChatData } from '../types';

const Dashboard = () => {
  const [data, setData] = useState<ChatData[]>([
    {
      id: 1,
      user: "How can I learn React?",
      bot: "Start with the official React documentation and practice building small projects. Focus on understanding core concepts like components, props, and state.",
      timestamp: "2024-03-15 10:30:00"
    },
    {
      id: 2,
      user: "What is TypeScript?",
      bot: "TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static types, classes, and modules to JavaScript.",
      timestamp: "2024-03-15 10:35:00"
    },
    {
      id: 3,
      user: "Explain async/await",
      bot: "async/await is a way to handle promises in JavaScript. It makes asynchronous code look and behave more like synchronous code, making it easier to understand and maintain.",
      timestamp: "2024-03-15 10:40:00"
    }
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<ChatData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/api/chats');
      const result = await response.json();
      setData([...result].reverse());  // Reverse to show newest first
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${id}`, {
        method: 'DELETE'
      });
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleEdit = (chat: ChatData) => {
    setEditingId(chat.id);
    setEditForm(chat);
  };

  const handleSave = async () => {
    if (!editForm) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${editForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      setData(data.map(item => item.id === editForm.id ? editForm : item));
      setEditingId(null);
      setEditForm(null);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="h-screen w-screen mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Conversation History</h1>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bot</th>
                <th className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map(chat => (
                <tr key={chat.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 text-sm text-gray-500">{chat.id}</td>
                  <td className="px-6 py-4">
                    {editingId === chat.id ? (
                      <textarea
                        value={editForm?.user || ''}
                        onChange={e => setEditForm(prev => prev ? {...prev, user: e.target.value} : null)}
                        className="w-full border rounded px-2 py-1 min-h-[60px]"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 line-clamp-3">{chat.user}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === chat.id ? (
                      <textarea
                        value={editForm?.bot || ''}
                        onChange={e => setEditForm(prev => prev ? {...prev, bot: e.target.value} : null)}
                        className="w-full border rounded px-2 py-1 min-h-[60px]"
                      />
                    ) : (
                      <div className="text-sm text-gray-900 line-clamp-3">{chat.bot}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(chat.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-2 justify-center">
                      {editingId === chat.id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900 transition-colors duration-150 transform hover:scale-110"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditForm(null);
                            }}
                            className="text-gray-600 hover:text-gray-900 transition-colors duration-150 transform hover:scale-110"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(chat)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-150 transform hover:scale-110"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(chat.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-150 transform hover:scale-110"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;