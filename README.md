# AI Resume Evaluator Demo

A comprehensive AI-powered resume evaluation platform designed specifically for HR screening purposes. This demo serves as a proof-of-concept for building a robust rule-based resume evaluation system that enables HR professionals to create, test, and optimize their screening criteria.

## 🎯 Project Overview

The AI Resume Evaluator is a rule builder and testing platform that empowers HR teams to:

- **Create Custom Evaluation Rules**: Define specific criteria and weightings for resume evaluation
- **Set Up Blacklist Filters**: Implement immediate rejection criteria for specific companies or educational backgrounds
- **Test and Refine Rules**: Validate evaluation logic with real resumes and job descriptions
- **Standardize HR Processes**: Ensure consistent and fair resume screening across the organization

This project is designed to be a complete HR screening solution that can evolve from a demo into a production-ready platform.

## 🚀 Current Features (Version 0.1.0 - 75% Complete)

### ✅ Implemented Features

**1. Complete Rule Management System**
- Dynamic evaluation rule creation with custom descriptions
- Weighted scoring system (0.1-1.0 weights, must sum to 1.0)
- Real-time validation of rule weights
- Add/remove rules functionality
- Persistent storage using localStorage
- Support for both rating (0-5 scale) and blacklist (true/false) rules

**2. Advanced Blacklist Management**
- Company blacklist: Immediate rejection based on previous employers
- Educational degree blacklist: Filter out specific educational backgrounds
- Toggle-based activation for each blacklist type
- Integration with evaluation engine for instant disqualification

**3. Complete User Interface**
- Modern, responsive design built with Next.js and Tailwind CSS
- Intuitive rule builder interface with real-time updates
- Clean form layouts for resume and job description input
- Comprehensive rule preview and validation system
- Fully functional header with settings modal

**4. Multi-Provider LLM Integration**
- Support for multiple LLM providers (OpenAI, Qwen, Deepseek)
- Secure API key management with masked input
- Provider-specific configuration options
- Complete integration with evaluation engine

**5. Core Evaluation Engine**
- AI-powered resume analysis using structured prompts
- Parallel rule evaluation for optimal performance
- Weighted scoring implementation with final score calculation
- Blacklist filtering logic with immediate disqualification
- Comprehensive scoring breakdown and percentage calculations
- Schema-based response validation using Zod

**6. Data Persistence & State Management**
- Complete localStorage integration for configuration persistence
- Rule and blacklist data persistence across sessions
- Robust error handling and data validation
- Custom React hooks for configuration management

### 🔧 Current Architecture Overview

```
├── Frontend (Complete)
│   ├── components/
│   │   ├── forms/           # Input forms and action buttons
│   │   │   ├── jd-input.tsx         # Job description input
│   │   │   ├── resume-input.tsx     # Resume text input
│   │   │   ├── action-buttons.tsx   # Start evaluation button
│   │   │   └── evaluation-result.tsx # Results display
│   │   ├── header/          # Application header and settings
│   │   │   ├── header.tsx           # Main header component
│   │   │   └── key-config-modal.tsx # API configuration modal
│   │   ├── rules/           # Rule management system
│   │   │   ├── blacklist.tsx        # Blacklist configuration
│   │   │   ├── evaluation-rules.tsx # Rule builder interface
│   │   │   ├── ruleset.tsx          # Combined rules interface
│   │   │   └── rules-preview.tsx    # Rule validation preview
│   │   └── ui/              # Reusable UI components (Radix-based)
│   └── lib/
│       ├── functions/storage.ts    # localStorage data persistence
│       ├── hooks/useConfig.ts      # Configuration management
│       └── llm/                    # LLM integration layer
│           ├── core/
│           │   ├── evaluator.ts    # Core evaluation logic
│           │   └── client.ts       # LLM client factory
│           ├── prompts/            # AI prompt templates
│           │   ├── system_prompt.ts
│           │   ├── user_prompt_template.ts
│           │   └── schema_evaluator.ts
│           └── providers/          # Multi-provider support
│               ├── base.ts         # Abstract provider interface
│               ├── openai.ts       # OpenAI integration
│               ├── deepseek.ts     # DeepSeek integration
│               └── qwen.ts         # Qwen integration
├── Backend Infrastructure (Ready)
│   └── api/v1/             # API endpoint structure (placeholder)
│       ├── evaluate/       # Evaluation endpoints
│       └── rules/          # Rule management endpoints
```

## 🎨 Tech Stack

- **Framework**: Next.js 15.5.0 with React 19
- **Styling**: Tailwind CSS v4 with modern animations
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React for consistent iconography
- **Package Manager**: pnpm for efficient dependency management
- **TypeScript**: Full type safety throughout the application
- **AI Integration**: OpenAI API with support for multiple providers
- **Schema Validation**: Zod for structured response validation
- **State Management**: React hooks with localStorage persistence

## 🚧 Development Roadmap

### Phase 1: Frontend Foundation ✅ COMPLETED (100%)
- [x] Complete UI component library with Radix UI
- [x] Advanced rule management interface
- [x] Comprehensive blacklist configuration
- [x] Multi-provider API key configuration
- [x] Form validation and error handling
- [x] Rules preview and validation system
- [x] Data persistence with localStorage
- [x] Responsive design implementation

### Phase 2: Core Evaluation Engine ✅ COMPLETED (100%)
- [x] Multi-provider LLM integration (OpenAI, DeepSeek, Qwen)
- [x] AI-powered resume analysis with structured prompts
- [x] Parallel rule evaluation for optimal performance
- [x] Weighted scoring implementation
- [x] Blacklist filtering logic with instant disqualification
- [x] Schema-based response validation
- [x] Comprehensive scoring breakdown

### Phase 3: Backend API Integration 🚧 IN PROGRESS (25%)
- [x] API endpoint structure setup
- [ ] Complete API route implementation
- [ ] Frontend-backend integration
- [ ] End-to-end evaluation workflow
- [ ] Error handling and response formatting

### Phase 4: Production Features (Planned)
- [ ] Resume file upload and parsing (PDF, DOCX)
- [ ] Batch processing capabilities
- [ ] Detailed evaluation reports with explanations
- [ ] Analytics dashboard for rule effectiveness
- [ ] User authentication and role management
- [ ] Database integration for persistent data storage

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume_evaluator_demo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

1. **API Setup**: Click the settings icon in the header to configure your LLM API key
   - Choose from OpenAI, DeepSeek, or Qwen providers
   - Enter your API key securely (masked input)
   - Configuration is automatically saved to localStorage

2. **Rule Creation**: Use the Rules section to define your evaluation criteria
   - Create custom rating rules (0-5 scale) with descriptions and weights
   - Set up blacklist rules for instant disqualification
   - Weights must total 1.0 for proper scoring

3. **Testing**: Input job descriptions and resumes to test your rule configurations
   - Paste job description and resume text
   - Click "Start" to begin AI-powered evaluation
   - View detailed scoring and reasoning

## 📋 Usage Guide

### Setting Up Evaluation Rules

1. **Access the Rules section** in the main interface
2. **Define evaluation criteria** with clear descriptions
3. **Assign weights** to each rule (must total 1.0)
4. **Add or remove rules** as needed using the + and trash icons

### Configuring Blacklists

1. **Enable company blacklist** to reject candidates from specific companies
2. **Enable degree blacklist** to filter out certain educational backgrounds
3. **Enter criteria** in the input fields when enabled

### API Configuration

1. **Click the settings icon** in the header
2. **Select your LLM provider** (OpenAI, Qwen, or Deepseek)
3. **Enter your API key** securely
4. **Save configuration** for use in evaluations

## 🏗️ Project Architecture

The application follows a sophisticated modular architecture designed for scalability:

- **Presentation Layer**: React components with Tailwind CSS styling and Radix UI primitives
- **State Management**: Custom React hooks with localStorage persistence
- **AI Integration Layer**: Multi-provider LLM support with abstract interfaces
- **Evaluation Engine**: Parallel processing with structured prompt templates
- **API Layer**: Next.js API routes (structure ready, implementation in progress)
- **Data Layer**: Browser-based persistence with planned database integration

## 🔮 Future Vision

This demo is designed to evolve into a comprehensive HR screening platform that will include:

- **AI-Powered Analysis**: Advanced natural language processing for resume understanding
- **Customizable Workflows**: Flexible evaluation pipelines for different roles
- **Analytics Dashboard**: Insights into hiring patterns and rule effectiveness
- **Integration Capabilities**: Seamless connection with existing HR tools
- **Scalable Architecture**: Support for enterprise-level usage

## 🤝 Contributing

This project is currently in active development. As we progress beyond the demo phase:

1. Follow the existing code structure and conventions
2. Ensure TypeScript compatibility
3. Add appropriate tests for new features
4. Update documentation for any new functionality

## 📄 License

This project is part of a demonstration/proof-of-concept development phase.

## 🔄 Development Status

**Current Progress**: 75% Complete - Major Milestone Achieved! 🎉

- ✅ **Frontend UI Components** - Complete modern interface with Radix UI
- ✅ **Advanced Rule Management** - Full CRUD with validation and persistence  
- ✅ **Multi-Provider LLM Integration** - OpenAI, DeepSeek, Qwen support
- ✅ **Core Evaluation Engine** - Parallel processing with schema validation
- ✅ **Data Persistence Layer** - localStorage with robust error handling
- 🚧 **Backend API Integration** - Structure ready, routes in development
- ⏳ **Production Features** - File upload, authentication, analytics

### Key Achievements
- **Functional AI Evaluation**: Complete end-to-end evaluation capability
- **Production-Ready Frontend**: Responsive, accessible, and performant
- **Scalable Architecture**: Modular design with clear separation of concerns
- **Multi-Provider Support**: Flexible LLM integration for different use cases

---

*This README will be updated as the project progresses through each development phase.*
