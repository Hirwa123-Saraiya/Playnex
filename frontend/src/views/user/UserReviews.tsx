import React, { useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const UserReviews: React.FC = () => {
  const { reviews, clubs, facilities, addReview } = useUserStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [targetType, setTargetType] = useState<'club' | 'facility'>('facility');
  const [selectedTargetId, setSelectedTargetId] = useState(facilities[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetName =
      targetType === 'club'
        ? clubs.find((c) => c.id === selectedTargetId)?.name || 'Club'
        : facilities.find((f) => f.id === selectedTargetId)?.name || 'Facility';

    addReview({
      targetType,
      targetId: selectedTargetId,
      targetName,
      rating,
      comment,
    });

    setModalOpen(false);
    setComment('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Star className="w-4 h-4 fill-amber-500" />
            <span>Community Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Reviews & Ratings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Share feedback on court surface quality, swimming water hygiene, and club hospitality.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={rev.userAvatar} alt={rev.userName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{rev.userName}</h4>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800">
              {rev.targetName}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>

            {rev.images && rev.images.length > 0 && (
              <div className="flex gap-2 pt-1">
                {rev.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Review attachment"
                    className="w-16 h-16 rounded-xl object-cover border"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">Write a Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('facility');
                    setSelectedTargetId(facilities[0].id);
                  }}
                  className={`py-1.5 font-bold rounded-lg ${
                    targetType === 'facility' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Facility
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('club');
                    setSelectedTargetId(clubs[0].id);
                  }}
                  className={`py-1.5 font-bold rounded-lg ${
                    targetType === 'club' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sports Club
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Select {targetType === 'club' ? 'Club' : 'Facility'}
                </label>
                <select
                  value={selectedTargetId}
                  onChange={(e) => setSelectedTargetId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-semibold cursor-pointer"
                >
                  {targetType === 'club'
                    ? clubs.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    : facilities.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.clubName})
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${num <= rating ? 'fill-amber-400' : 'text-slate-200'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about cleanliness, court bounce, coaching, or locker facilities..."
                  className="w-full p-3 bg-slate-50 border rounded-xl font-normal"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
