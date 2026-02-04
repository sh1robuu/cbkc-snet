import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    BookOpen,
    Clock,
    User,
    ArrowLeft,
    Tag,
    Share2
} from 'lucide-react';
import { MainLayout, GlassCard } from '../../components/Layout';
import { mockBlogPosts } from '../../data/mockBlogPosts';

const BlogPage = () => {
    const { postId } = useParams();
    const [searchQuery, setSearchQuery] = useState('');

    // If postId exists, show single post
    if (postId) {
        const post = mockBlogPosts.find(p => p.id === postId);

        if (!post) {
            return (
                <MainLayout>
                    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                        <h1 className="text-2xl font-bold text-gray-700">Bài viết không tồn tại</h1>
                        <Link to="/blog" className="btn-primary mt-4 inline-block">
                            Quay lại Blog
                        </Link>
                    </div>
                </MainLayout>
            );
        }

        return (
            <MainLayout>
                <article className="max-w-4xl mx-auto px-4 py-8">
                    {/* Back Button */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Quay lại Blog
                    </Link>

                    {/* Cover Image */}
                    <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-64 md:h-80 object-cover"
                        />
                    </div>

                    {/* Post Header */}
                    <GlassCard hover={false} className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={post.authorAvatar}
                                alt={post.authorName}
                                className="w-12 h-12 rounded-full border-2 border-white/50"
                            />
                            <div>
                                <p className="font-semibold text-gray-800">{post.authorName}</p>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <span>{post.readTime} phút đọc</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span key={tag} className="tag">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Post Content */}
                    <GlassCard hover={false}>
                        <div
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>').replace(/## /g, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-800">').replace(/# /g, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-800">') }}
                        />
                    </GlassCard>

                    {/* Share */}
                    <div className="mt-8 text-center">
                        <button className="btn-ghost inline-flex items-center gap-2">
                            <Share2 className="w-5 h-5" />
                            Chia sẻ bài viết
                        </button>
                    </div>
                </article>
            </MainLayout>
        );
    }

    // Blog List View
    const filteredPosts = mockBlogPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4">
                        <BookOpen className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">Kiến thức tâm lý</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        Blog chuyên môn
                    </h1>
                    <p className="text-gray-600 max-w-lg mx-auto">
                        Bài viết chuyên sâu về tâm lý học đường từ các giáo viên tư vấn
                    </p>
                </div>

                {/* Search */}
                <div className="max-w-md mx-auto mb-10">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm bài viết..."
                        className="glass-input text-center"
                    />
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <Link key={post.id} to={`/blog/${post.id}`}>
                            <GlassCard className="h-full overflow-hidden" padding="p-0">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <img
                                            src={post.authorAvatar}
                                            alt={post.authorName}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="text-sm">
                                            <p className="font-medium text-gray-700">{post.authorName}</p>
                                            <p className="text-gray-400 text-xs">{post.readTime} phút đọc</p>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3">{post.excerpt}</p>
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {post.tags.slice(0, 2).map((tag) => (
                                            <span key={tag} className="tag text-xs">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
};

export default BlogPage;
