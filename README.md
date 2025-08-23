# AI Resume Evaluator Demo

A comprehensive AI-powered resume evaluation platform designed specifically for HR screening purposes. This demo serves as a proof-of-concept for building a robust rule-based resume evaluation system that enables HR professionals to create, test, and optimize their screening criteria.

## 🎯 Project Overview

The AI Resume Evaluator is a rule builder and testing platform that empowers HR teams to:

- **Create Custom Evaluation Rules**: Define specific criteria and weightings for resume evaluation
- **Set Up Blacklist Filters**: Implement immediate rejection criteria for specific companies or educational backgrounds
- **Test and Refine Rules**: Validate evaluation logic with real resumes and job descriptions
- **Standardize HR Processes**: Ensure consistent and fair resume screening across the organization

This project is designed to be a complete HR screening solution that can evolve from a demo into a production-ready platform.

## 🚀 Current Features (Version 0.1.0 - 20% Complete)

### ✅ Implemented Features

**1. Rule Management System**
- Dynamic evaluation rule creation with custom descriptions
- Weighted scoring system (0.1-1.0 weights, must sum to 1.0)
- Real-time validation of rule weights
- Add/remove rules functionality

**2. Blacklist Management**
- Company blacklist: Immediate rejection based on previous employers
- Educational degree blacklist: Filter out specific educational backgrounds
- Toggle-based activation for each blacklist type

**3. User Interface**
- Modern, responsive design built with Next.js and Tailwind CSS
- Intuitive rule builder interface
- Clean form layouts for resume and job description input
- Real-time feedback and validation

**4. API Configuration**
- Support for multiple LLM providers (OpenAI, Qwen, Deepseek)
- Secure API key management with masked input
- Provider-specific configuration options

### 🔧 Current Component Structure

```
├── components/
│   ├── forms/           # Input forms and action buttons
│   │   ├── jd-input.tsx         # Job description input
│   │   ├── resume-input.tsx     # Resume text input
│   │   ├── action-buttons.tsx   # Start evaluation button
│   │   └── evaluation-result.tsx # Results display
│   ├── header/          # Application header and settings
│   │   ├── header.tsx           # Main header component
│   │   └── key-config-modal.tsx # API configuration
│   ├── rules/           # Rule management system
│   │   ├── blacklist.tsx        # Blacklist configuration
│   │   ├── evaluation-rules.tsx # Rule builder
│   │   ├── ruleset.tsx          # Combined rules interface
│   │   └── rules-preview.tsx    # Rule validation preview
│   └── ui/              # Reusable UI components (Radix-based)
```

## 🎨 Tech Stack

- **Framework**: Next.js 15.5.0 with React 19
- **Styling**: Tailwind CSS v4 with modern animations
- **UI Components**: Radix UI primitives for accessibility
- **Icons**: Lucide React for consistent iconography
- **Package Manager**: pnpm for efficient dependency management
- **TypeScript**: Full type safety throughout the application

## 🚧 Development Roadmap

### Phase 1: Frontend Foundation (Current - 20% Complete)
- [x] Basic UI components and layout
- [x] Rule management interface
- [x] Blacklist configuration
- [x] API key configuration
- [ ] Form validation and error handling
- [ ] Rules preview and validation

### Phase 2: Backend Integration (Upcoming - 0% Complete)
- [ ] API endpoints for rule processing
- [ ] LLM integration for resume evaluation
- [ ] Resume parsing and text extraction
- [ ] Scoring algorithm implementation
- [ ] Database integration for rule persistence

### Phase 3: Evaluation Engine (Planned)
- [ ] AI-powered resume analysis
- [ ] Weighted scoring implementation
- [ ] Blacklist filtering logic
- [ ] Detailed evaluation reports
- [ ] Batch processing capabilities

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
2. **Rule Creation**: Use the Rules section to define your evaluation criteria
3. **Testing**: Input job descriptions and resumes to test your rule configurations

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

The application follows a modular component-based architecture:

- **Presentation Layer**: React components with Tailwind CSS styling
- **State Management**: React hooks for local state management
- **API Layer**: (Future) RESTful endpoints for backend communication
- **Data Layer**: (Future) Database integration for persistent storage

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

**Current Progress**: 20% Complete
- ✅ Frontend UI components
- ✅ Rule management interface  
- ✅ Basic form structure
- 🚧 Backend API development
- ⏳ AI evaluation engine
- ⏳ Data persistence layer

---

*This README will be updated as the project progresses through each development phase.*
