// Mock blog posts data
export const mockBlogPosts = [
    {
        id: 'blog-1',
        title: '5 Cách Đối Phó Với Áp Lực Học Tập Hiệu Quả',
        excerpt: 'Áp lực học tập là điều mà hầu hết học sinh đều phải đối mặt. Bài viết này sẽ chia sẻ 5 phương pháp đã được chứng minh khoa học giúp bạn vượt qua...',
        content: `
# 5 Cách Đối Phó Với Áp Lực Học Tập Hiệu Quả

Áp lực học tập là điều mà hầu hết học sinh đều phải đối mặt, đặc biệt trong mùa thi. Nếu không được quản lý tốt, stress có thể ảnh hưởng nghiêm trọng đến sức khỏe tinh thần và kết quả học tập.

## 1. Lập Kế Hoạch Học Tập Hợp Lý

Thay vì học dồn, hãy chia nhỏ khối lượng học tập thành các phần nhỏ hơn. Sử dụng phương pháp Pomodoro: học 25 phút, nghỉ 5 phút.

## 2. Ngủ Đủ Giấc

Giấc ngủ rất quan trọng cho việc ghi nhớ và xử lý thông tin. Hãy đảm bảo ngủ ít nhất 7-8 tiếng mỗi đêm.

## 3. Tập Thể Dục Đều Đặn

Hoạt động thể chất giúp giải phóng endorphin - hormone hạnh phúc. Chỉ cần 30 phút đi bộ mỗi ngày cũng có thể tạo ra sự khác biệt lớn.

## 4. Nói Chuyện Với Người Tin Tưởng

Đừng giữ mọi thứ trong lòng. Chia sẻ với bạn bè, gia đình, hoặc giáo viên tư vấn khi bạn cảm thấy quá tải.

## 5. Thực Hành Chánh Niệm

Dành 5-10 phút mỗi ngày để thiền hoặc hít thở sâu. Điều này giúp tâm trí bình tĩnh và tập trung hơn.
    `,
        authorId: 'teacher-1',
        authorName: 'Thầy Nguyễn Văn Minh',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher1',
        tags: ['học tập', 'stress', 'sức khỏe tinh thần'],
        coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
        publishedAt: '2026-02-01T08:00:00Z',
        readTime: 5
    },
    {
        id: 'blog-2',
        title: 'Làm Sao Để Giao Tiếp Hiệu Quả Với Bố Mẹ?',
        excerpt: 'Mâu thuẫn với bố mẹ là điều thường gặp ở tuổi dậy thì. Bài viết này giúp bạn hiểu và cải thiện mối quan hệ gia đình...',
        content: `
# Làm Sao Để Giao Tiếp Hiệu Quả Với Bố Mẹ?

Ở tuổi dậy thì, nhiều bạn cảm thấy bố mẹ không hiểu mình. Đây là điều hoàn toàn bình thường, nhưng việc cải thiện giao tiếp là rất quan trọng.

## Hiểu Góc Nhìn Của Bố Mẹ

Bố mẹ lo lắng vì họ yêu thương bạn. Hãy thử đặt mình vào vị trí của họ để hiểu tại sao họ có những quy định nhất định.

## Chọn Thời Điểm Phù Hợp

Đừng nói chuyện khi đang tức giận. Hãy chờ khi mọi người đều bình tĩnh để có cuộc trò chuyện hiệu quả hơn.

## Lắng Nghe Trước Khi Phản Bác

Thay vì phản đối ngay, hãy lắng nghe hết ý kiến của bố mẹ. Điều này cho thấy bạn tôn trọng họ.

## Thể Hiện Cảm Xúc Bằng "Tôi"

Thay vì nói "Bố mẹ lúc nào cũng kiểm soát con", hãy thử "Con cảm thấy áp lực khi...". Cách này ít gây phòng thủ hơn.
    `,
        authorId: 'teacher-4',
        authorName: 'Cô Phạm Thu Hằng',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher4',
        tags: ['gia đình', 'giao tiếp', 'quan hệ'],
        coverImage: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800',
        publishedAt: '2026-01-28T10:00:00Z',
        readTime: 4
    },
    {
        id: 'blog-3',
        title: 'Nhận Biết Và Vượt Qua Trầm Cảm Tuổi Học Đường',
        excerpt: 'Trầm cảm không phải là sự yếu đuối. Hiểu về các dấu hiệu và tìm kiếm sự giúp đỡ là bước đầu tiên quan trọng...',
        content: `
# Nhận Biết Và Vượt Qua Trầm Cảm Tuổi Học Đường

Trầm cảm có thể xảy ra với bất kỳ ai, kể cả học sinh. Việc nhận biết sớm và tìm kiếm sự giúp đỡ là rất quan trọng.

## Dấu Hiệu Nhận Biết

- Cảm thấy buồn bã, trống rỗng kéo dài
- Mất hứng thú với những hoạt động từng yêu thích
- Thay đổi giấc ngủ và khẩu vị
- Khó tập trung, điểm số giảm sút
- Có suy nghĩ tiêu cực về bản thân

## Khi Nào Cần Tìm Giúp Đỡ?

Nếu những cảm xúc này kéo dài hơn 2 tuần, hãy nói chuyện với người lớn tin tưởng hoặc giáo viên tư vấn.

## Bạn Không Đơn Độc

Nhớ rằng trầm cảm có thể điều trị được. Việc tìm kiếm sự giúp đỡ không phải là yếu đuối - đó là dũng cảm.
    `,
        authorId: 'teacher-2',
        authorName: 'Cô Trần Thị Lan',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher2',
        tags: ['sức khỏe tinh thần', 'trầm cảm', 'hỗ trợ'],
        coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
        publishedAt: '2026-01-25T14:00:00Z',
        readTime: 6
    }
];

export default mockBlogPosts;
