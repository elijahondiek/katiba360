# Katiba360° 🇰🇪

**Making Kenya's constitution accessible to everyone through simple language and practical examples.**

> 📡 **Related Repository:** [Katiba360° Backend API](https://github.com/elijahondiek/katiba360-backend) - The FastAPI backend powering this platform

## 🚀 Calling All Developers!

We're actively seeking developers to help improve Katiba360° and make Kenya's constitution truly accessible to every citizen. Whether you **code**, **craft UX**, **translate**, or **test** – your talents can empower every Kenyan with constitutional knowledge!

### 🎯 Priority Features We Need Help With

1. **🧪 Testing Infrastructure** (Most Needed!)
   - Set up comprehensive testing framework (Jest/React Testing Library)
   - Add unit tests for components and hooks
   - Implement integration tests for user flows
   - Add end-to-end testing capabilities

2. **🛡️ Error Handling & Production Readiness**
   - Implement global error boundaries
   - Configure production console log removal
   - Add performance monitoring and analytics
   - Implement comprehensive error tracking

3. **🚀 Performance Optimization**
   - Implement code splitting for large components
   - Add bundle analysis and optimization
   - Enable Next.js image optimization
   - Add virtualization for long lists

4. **📱 PWA Capabilities** ✅ **Recently Implemented!**
   - ✅ Service worker for offline functionality
   - ✅ App manifest for installability
   - ✅ Offline caching strategies
   - ⏳ Background sync capabilities (coming soon)
   - ⏳ Push notifications (planned)

5. **🔍 Advanced Search Features**
   - Implement search result highlighting
   - Add search filters and sorting
   - Implement voice search integration
   - Add search history and suggestions

6. **♿ Accessibility Enhancements**
   - Complete ARIA labels and roles
   - Add keyboard navigation support
   - Implement high contrast mode
   - Add screen reader optimization

## ✨ Current Features

### 🔐 **Authentication & User Management**
- **Google OAuth Integration:** Secure authentication with automatic token refresh
- **User Profiles:** Complete profile management with preferences and settings
- **Offline Authentication:** Authentication works even when offline
- **Protected Routes:** Secure route protection with middleware

### 🌍 **Multilingual Support**
- **6 Language Support:** English, Swahili, Kikuyu, Luo, Kalenjin, and Kamba
- **Dynamic Language Switching:** Seamless language switching with UI
- **Translation Fallbacks:** Intelligent fallback handling for missing translations
- **Persistent Language Preference:** User language choices saved automatically

### 📖 **Constitution Content**
- **Complete Constitution:** All 18 chapters with 12,675+ lines of content
- **Structured Content:** Proper hierarchy with articles, clauses, and sub-clauses
- **Full-text Search:** Quickly find articles, chapters, and rights
- **Smart Reading Progress:** Content-aware completion tracking with realistic thresholds

### 📱 **Offline Functionality & PWA**
- **Progressive Web App:** Full PWA support with installability
- **Service Worker:** Offline caching for static assets and API responses
- **Comprehensive Offline Support:** IndexedDB-based content storage
- **Chapter Downloads:** Download individual chapters for offline reading
- **Offline Sync:** Automatic synchronization when back online
- **Offline Status Indicators:** Clear indicators for offline/online status
- **Install to Home Screen:** Works as a native app on mobile devices

### 🎨 **User Experience**
- **Responsive Design:** Seamless experience on desktop and mobile
- **Educational Resources:** Learn about rights, chapters, and key constitutional concepts
- **Interactive Scenarios:** Real-world constitutional applications
- **Optimized Bookmarking:** Efficient bookmark management with reduced API calls
- **Improved Profile UI:** Streamlined profile dropdown with better UX

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS, Radix UI
- **State Management:** React Context
- **Authentication:** Custom OAuth with Google
- **Icons:** Lucide React
- **PWA:** next-pwa with Workbox
- **Backend API:** FastAPI (Python)
- **Database:** PostgreSQL
- **Offline Storage:** IndexedDB

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/elijahondiek/katiba360.git
   cd katiba360-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.local.sample .env.local
   # Update the variables with your values
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🎨 Design System

The Katiba360° application follows a unified visual identity:

```
[Color Palette]
Primary Green: #0A7B24
Secondary Green: #1EB53A
Accent Red: #CE1126
Neutral Gray: #374151, #E5E7EB, #F3F4F6
Supporting: #9CA3AF, #D1D5DB

Typography: Inter, system-ui, sans-serif
Button Style: Rounded, green primary, outlined secondary
Shadow: Subtle, for elevation
```

For the complete design guide, see `Global Design Guide.txt`.

## 🤝 How to Contribute

### 🔥 Quick Contribution Areas

1. **Translation Work**
   - Help translate to Kikuyu, Luo, Kalenjin, Kamba, and other local languages
   - Review and improve existing translations
   - Add missing constitutional terms and phrases

2. **Content Completion**
   - Compare our data with [official constitution](https://new.kenyalaw.org/akn/ke/act/2010/constitution/eng@2010-09-03)
   - Fill in missing articles, sections, or clauses
   - Verify accuracy of existing content

3. **Frontend Development**
   - Implement offline functionality
   - Enhance user profiles and achievements
   - Improve accessibility features
   - Mobile optimization

4. **Testing & QA**
   - Test on different devices and browsers
   - Report bugs and edge cases
   - Validate translation accuracy
   - User experience testing

### 📋 Contribution Process

1. **Fork the repository** and create your branch from `main`
2. **Check our issues** for specific tasks or create new ones
3. **Follow the code style guidelines** and design system
4. **Write clear commit messages** and document your changes
5. **Test thoroughly** before submitting
6. **Open a pull request** with detailed description

### 💡 Development Tips

- Check the `/translations` folder for existing language files
- Review components in `/components` for UI patterns
- Look at `/hooks` for existing custom hooks
- Follow the established folder structure
- Use TypeScript for type safety

## 📂 Project Structure

```
katiba360-app/
├── app/                    # Next.js 14 App Router
│   ├── chapters/          # Constitution chapters
│   ├── about/             # About pages (team, mission, etc.)
│   ├── search/            # Search functionality
│   └── ...
├── components/            # Reusable React components
├── contexts/              # React context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── translations/          # Language files
└── styles/               # Global styles
```

## 🌟 Join Our Mission

**Our Goal:** Make Kenya's constitution accessible to every citizen, regardless of their education level, language, or technical expertise.

**How You Help:** Your contributions directly impact millions of Kenyans who deserve to understand their rights and responsibilities as citizens.

### 🔗 Get Connected

- **GitHub Issues:** [Report bugs or request features](https://github.com/elijahondiek/katiba360/issues)
- **Discussions:** [Join community discussions](https://github.com/elijahondiek/katiba360/discussions)
- **Backend Repository:** [Katiba360° Backend API](https://github.com/elijahondiek/katiba360-backend)
- **Twitter:** [@WebShrewd](https://x.com/WebShrewd)
- **Support the project:** [Buy me a coffee](https://buymeacoffee.com/Teksad)

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Constitution of Kenya, 2010
- All contributors and volunteers
- The Kenyan developer community
- Organizations promoting civic education

---

**Together, let's empower every Kenyan with constitutional knowledge! 🇰🇪**

*Whether you code, craft UX, translate or test – your talents can empower every Kenyan with Katiba360°!*