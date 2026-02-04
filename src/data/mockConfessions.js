// Mock confessions data
export const mockConfessions = [
    {
        id: 'conf-1',
        content: 'Mình cảm thấy áp lực quá khi kỳ thi sắp đến. Mỗi ngày học từ sáng đến khuya mà vẫn cảm thấy không đủ. Mình sợ làm bố mẹ thất vọng...',
        authorId: 'anonymous',
        anonymityLevel: 'full',
        topic: 'psychology',
        status: 'approved',
        likes: 42,
        comments: [
            {
                id: 'cmt-1',
                content: 'Mình cũng vậy, bạn không đơn độc đâu! Cố lên nhé 💪',
                authorId: 'anonymous',
                createdAt: '2026-02-02T10:30:00Z'
            },
            {
                id: 'cmt-2',
                content: 'Hãy nhớ nghỉ ngơi đúng cách nhé bạn, sức khỏe quan trọng lắm',
                authorId: 'anonymous',
                createdAt: '2026-02-02T11:15:00Z'
            }
        ],
        createdAt: '2026-02-02T08:00:00Z'
    },
    {
        id: 'conf-2',
        content: 'Crush mình có người yêu rồi 😢 Mình biết nên buông nhưng sao khó quá. Mỗi ngày nhìn thấy hai người họ mình lại thấy đau...',
        authorId: 'anonymous',
        anonymityLevel: 'full',
        topic: 'psychology',
        status: 'approved',
        likes: 89,
        comments: [
            {
                id: 'cmt-3',
                content: 'Thời gian sẽ chữa lành mọi thứ, tin mình đi 🌸',
                authorId: 'anonymous',
                createdAt: '2026-02-01T15:20:00Z'
            }
        ],
        createdAt: '2026-02-01T14:00:00Z'
    },
    {
        id: 'conf-3',
        content: 'Hôm nay mình nấu được món ăn ngon lần đầu tiên! Mẹ khen ngon lắm, mình vui quá trời 🥰',
        authorId: 'anonymous',
        anonymityLevel: 'partial',
        topic: 'offtopic',
        status: 'approved',
        likes: 156,
        comments: [
            {
                id: 'cmt-4',
                content: 'Wow giỏi quá! Chia sẻ công thức đi bạn 😋',
                authorId: 'anonymous',
                createdAt: '2026-02-01T20:00:00Z'
            }
        ],
        createdAt: '2026-02-01T18:30:00Z'
    },
    {
        id: 'conf-4',
        content: 'Mình không biết phải làm gì với cuộc sống này nữa. Bố mẹ hay cãi nhau, ở trường cũng không có ai hiểu mình. Mình cảm thấy rất cô đơn...',
        authorId: 'anonymous',
        anonymityLevel: 'full',
        topic: 'psychology',
        status: 'approved',
        likes: 67,
        comments: [
            {
                id: 'cmt-5',
                content: 'Bạn ơi, hãy nói chuyện với giáo viên tư vấn nhé. Họ sẽ giúp bạn đó 💚',
                authorId: 'anonymous',
                createdAt: '2026-01-31T12:00:00Z'
            },
            {
                id: 'cmt-6',
                content: 'Mình cũng từng như vậy. Tin mình, mọi thứ sẽ tốt hơn thôi 🌈',
                authorId: 'anonymous',
                createdAt: '2026-01-31T14:30:00Z'
            }
        ],
        createdAt: '2026-01-31T10:00:00Z'
    },
    {
        id: 'conf-5',
        content: 'Vừa đậu học bổng du học! Cảm ơn tất cả những người đã ủng hộ mình suốt thời gian qua 🎉',
        authorId: 'anonymous',
        anonymityLevel: 'partial',
        topic: 'offtopic',
        status: 'approved',
        likes: 234,
        comments: [],
        createdAt: '2026-01-30T16:00:00Z'
    }
];

// Pending confessions for moderation
export const pendingConfessions = [
    {
        id: 'pending-1',
        content: 'Mình ghét cái trường này quá! Toàn những người giả tạo, mình muốn bỏ học...',
        authorId: 'anonymous',
        anonymityLevel: 'full',
        topic: 'psychology',
        status: 'review',
        aiConfidence: 65,
        aiReason: 'Nội dung chứa cảm xúc tiêu cực mạnh, cần xem xét',
        createdAt: '2026-02-03T09:00:00Z'
    },
    {
        id: 'pending-2',
        content: 'Có ai biết làm sao để vượt qua nỗi sợ nói trước đám đông không? Mình sắp phải thuyết trình mà run quá...',
        authorId: 'anonymous',
        anonymityLevel: 'full',
        topic: 'psychology',
        status: 'review',
        aiConfidence: 85,
        aiReason: 'Nội dung ổn, có thể duyệt',
        createdAt: '2026-02-03T10:30:00Z'
    }
];

export default mockConfessions;
