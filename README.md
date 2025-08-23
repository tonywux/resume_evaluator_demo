# AI Resume Evaluator Demo

A proof-of-concept application demonstrating AI-powered resume evaluation capabilities. This demo showcases how LLM technology can be used to create customizable resume screening workflows with rule-based evaluation and scoring.

## 🎯 Project Purpose

This is a **demonstration project** built to explore and validate the concept of AI-assisted resume evaluation. It serves as a technical proof-of-concept for:

- **Rule-Based Evaluation**: Custom scoring criteria with weighted importance
- **Multi-Provider LLM Integration**: Support for different AI providers (OpenAI, DeepSeek, Qwen)
- **Blacklist Filtering**: Automatic disqualification based on configurable criteria
- **Parallel Processing**: Efficient evaluation of multiple rules simultaneously
- **Interactive UI**: Real-time rule configuration and evaluation results

## ⚠️ Demo Limitations

This is a **proof-of-concept demo**, not a production system:

- **Manual Input Only**: Users must manually copy/paste resumes and job descriptions
- **No Data Persistence**: Uses localStorage for configuration (browser-only storage)
- **No User Management**: Single-user interface without authentication
- **Fixed Model Configuration**: Limited to predefined models and endpoints
- **No Database Integration**: Results are not stored for future reference
- **No Batch Processing**: Evaluates one resume at a time

## 🚀 Demo Features

### ✅ Implemented Demo Features

**🎛️ Rule Management Interface**
- **Custom Rule Creation**: Define evaluation criteria with descriptions and weights
- **Weight Validation**: Ensures total weights equal 1.0 for proper scoring
- **Rule CRUD Operations**: Add, edit, and remove evaluation rules
- **localStorage Persistence**: Configuration saved locally in browser
- **Dual Rule Types**: Rating rules (0-5 scale) and blacklist rules (true/false)

**🚫 Basic Blacklist System**
- **Company Blacklist**: Simple text-based company name filtering
- **Education Blacklist**: Basic degree/education filtering
- **Toggle Controls**: Enable/disable each blacklist type
- **Immediate Disqualification**: Stops evaluation when blacklist criteria match

**🎨 Demo User Interface**
- **Responsive Design**: Built with Next.js 15, React 19, and Tailwind CSS v4
- **shadcn/ui Components**: Modern UI components with accessibility features
- **Form Inputs**: Text areas for manual resume and job description entry
- **Results Display**: Shows evaluation scores and AI reasoning
- **Configuration Modal**: Settings dialog for API key input

**🔌 Multi-Provider AI Support**
- **Provider Options**: OpenAI, DeepSeek, and Qwen
- **API Key Management**: Secure local storage with masked input
- **Fixed Model Endpoints**: Predefined models and base URLs
- **Schema Validation**: Zod validation for consistent AI responses

**⚡ Evaluation Engine**
- **Parallel Processing**: Multiple rules evaluated simultaneously
- **Structured Prompts**: Role-specific prompts for different rule types
- **Weighted Scoring**: Final score calculation based on rule weights
- **Detailed Breakdown**: Shows individual rule scores and reasoning

**💾 Browser-Based Storage**
- **localStorage Only**: All data stored locally on user's computer
- **No Server Persistence**: Configurations don't sync across devices
- **Safe API Key Storage**: Keys stored locally, never sent to servers
- **Session Continuity**: Settings persist between browser sessions

### 🏗️ Technical Architecture

**Demo Tech Stack**
```
Frontend Framework     │ Next.js 15 with React 19
Styling               │ Tailwind CSS v4 with modern animations  
UI Components         │ shadcn/ui (built on Radix UI primitives)
State Management      │ React Context + Custom hooks
Data Persistence      │ localStorage (browser-only)
AI Integration        │ OpenAI, DeepSeek, Qwen APIs
Schema Validation     │ Zod for type-safe responses
Package Manager       │ pnpm for efficient dependency management
TypeScript            │ Full type safety throughout
```

**Application Structure**
```
src/
├── app/                    # Next.js App Router
│   ├── api/v1/evaluate/   # REST API for resume evaluation
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main application interface
│
├── components/
│   ├── forms/             # Input and result components
│   │   ├── jd-input.tsx          # Job description textarea
│   │   ├── resume-input.tsx      # Resume content textarea  
│   │   ├── action-buttons.tsx    # Evaluation trigger
│   │   └── evaluation-result.tsx # Results display with breakdown
│   ├── header/            # Application header
│   │   ├── header.tsx            # Main navigation
│   │   └── key-config-modal.tsx  # API configuration dialog
│   ├── rules/             # Rule management interface
│   │   ├── evaluation-rules.tsx  # Rating rule builder
│   │   ├── blacklist.tsx         # Blacklist configuration
│   │   └── ruleset.tsx           # Combined rule interface
│   └── ui/                # Reusable Radix UI components
│
├── lib/
│   ├── hooks/             # Custom React hooks
│   │   ├── useConfig.ts          # API configuration management
│   │   ├── useEvaluation.ts      # Evaluation state management
│   │   └── useInputs.tsx         # Form input management
│   ├── functions/
│   │   └── storage.ts            # localStorage utilities
│   └── llm/               # AI integration layer
│       ├── core/
│       │   ├── client.ts         # Evaluation client class
│       │   └── evaluator.ts      # Core evaluation engine
│       ├── prompts/              # AI prompt management
│       │   ├── system_prompt.ts  # System message templates
│       │   ├── user_prompt_template.ts # Dynamic user prompts
│       │   └── schema_evaluator.ts # Response schemas
│       └── providers/            # Multi-provider architecture
│           ├── base.ts           # Abstract provider interface
│           ├── openai.ts         # OpenAI implementation
│           ├── deepseek.ts       # DeepSeek implementation
│           └── qwen.ts           # Qwen implementation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (LTS version recommended)
- **pnpm** (preferred) or npm/yarn
- **API Key** from one of the supported providers:
  - OpenAI (GPT-4, GPT-5)
  - DeepSeek (deepseek-chat)  
  - Qwen (qwen-max-latest)

### Quick Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd resume_evaluator_demo
   pnpm install
   ```

2. **Start Development Server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser

3. **Configure API Provider**
   - Click the ⚙️ settings icon in the header
   - Select your AI provider (OpenAI, DeepSeek, or Qwen)
   - Enter your API key (securely masked)
   - Click "Save" to store configuration

4. **Set Up Evaluation Rules**
   - Create custom evaluation criteria with descriptions
   - Assign weights (must total 1.0)
   - Configure optional blacklist filters
   - Rules are automatically saved

5. **Start Evaluating**
   - Paste a job description
   - Paste a resume
   - Click "Start" to begin AI evaluation
   - Review detailed scoring and reasoning

## 📖 User Guide

### 🎛️ Setting Up Evaluation Rules

**Create Custom Rules**
1. Navigate to the "Evaluation Rules" section
2. Click the ➕ button to add new rules  
3. Enter a descriptive rule name (e.g., "Technical Skills Match")
4. Set the weight (0.1-1.0) - higher weights have more impact
5. Ensure all weights total exactly 1.0

**Rule Weight Examples**
```
Technical Skills     │ 0.4  (40% importance)
Experience Level     │ 0.3  (30% importance)  
Education Background │ 0.2  (20% importance)
Communication        │ 0.1  (10% importance)
Total               │ 1.0  ✅
```

### 🚫 Configuring Blacklists

**Company Blacklist**
- Toggle "Enable Company Blacklist"
- Enter company names to automatically reject (e.g., "Competitor Corp, Rival Inc")
- System detects subsidiaries and related entities

**Education Blacklist**  
- Toggle "Enable Degree Blacklist"
- Specify degree types or schools to filter (e.g., "High School, Community College")
- Immediate disqualification when criteria match

### 🤖 API Configuration

**Supported Providers**
- **OpenAI**: Industry-leading performance, higher cost
- **DeepSeek**: Cost-effective, competitive quality
- **Qwen**: Alternative option, good for specific use cases

**Setup Steps**
1. Click ⚙️ settings icon in header
2. Select provider from dropdown
3. Paste API key (input is masked for security)  
4. Click "Save" - configuration persists automatically

### 📊 Understanding Results

**Overall Score**
- Percentage score (0-100%) based on weighted rule evaluation
- Final score calculation: `(sum of weighted scores) / 5 * 100`
- Instant disqualification if blacklist criteria are met

**Detailed Breakdown**
- **Blacklist Results**: Shows which filters triggered (if any)
- **Rating Results**: Individual rule scores with AI reasoning
- **Metadata**: Provider, model, execution time, timestamp

**Score Interpretation**
```
90-100%  │ Excellent match
80-89%   │ Strong candidate  
70-79%   │ Good fit
60-69%   │ Adequate match
Below 60%│ Poor fit
```

## 🚀 Advanced Features

### ⚡ Parallel Processing Engine

The evaluation engine processes all rules simultaneously rather than sequentially, dramatically reducing evaluation time:

```
Traditional Sequential Processing:  
Rule 1 → Rule 2 → Rule 3 → Rule 4  (16 seconds)

Our Parallel Processing:
Rule 1 ┐
Rule 2 ├─→ Combined Result  (4 seconds)  
Rule 3 ┤
Rule 4 ┘
```

### 🧠 Intelligent Prompt Engineering

**Specialized System Prompts**
- **Rating Rules**: Optimized for 0-5 scoring with detailed reasoning
- **Blacklist Rules**: Binary qualification/disqualification logic
- **Context Injection**: Resume and job description automatically included

**Dynamic User Prompts**
- Rule-specific formatting based on evaluation type
- Global context access for consistent evaluation
- Provider-optimized templates (OpenAI vs Qwen format differences)

### 🛡️ Robust Error Handling

**Configuration Validation**
- API key format validation
- Rule weight sum verification (must equal 1.0)
- Provider availability checking

**Runtime Error Recovery**
- Graceful handling of API timeouts
- Automatic retry logic for transient failures
- User-friendly error messages with actionable guidance

**Data Integrity**
- localStorage corruption detection and recovery
- Schema validation for all stored data
- Automatic cleanup of invalid configurations

## 🔮 Production Implementation Considerations

This demo validates the core concept. A production system would require significant additional development:

### 🗄️ **Data Architecture**
- **Database Integration**: PostgreSQL/MongoDB for storing resumes, job descriptions, and evaluation results
- **User Management**: Authentication, authorization, and multi-tenant support
- **Audit Logging**: Complete history of evaluations for compliance and analysis
- **Data Security**: Encryption, access controls, and privacy compliance

### 🔄 **Automated Workflows**  
- **ATS Integration**: Direct connection to Workday, Greenhouse, BambooHR, etc.
- **Resume Parsing**: Automatic extraction from PDF/DOCX files
- **Job Description Auto-fetch**: Integration with job posting systems
- **Batch Processing**: Evaluate multiple candidates simultaneously
- **Result Storage**: Persistent evaluation history and candidate tracking

### ⚙️ **Configurable Infrastructure**
- **Dynamic Model Configuration**: Admin-configurable AI models and endpoints
- **Custom Base URLs**: Support for private/enterprise AI deployments
- **Scalable Processing**: Queue-based evaluation for high-volume scenarios
- **Performance Monitoring**: Metrics, logging, and system health monitoring

### 🔌 **Enterprise Integration**
- **REST API**: Full API for external system integration
- **Webhook Support**: Real-time notifications and event-driven workflows
- **SSO Integration**: SAML, OAuth, Active Directory support
- **Role-Based Access**: Different permission levels for HR teams

## 💡 Demo Use Cases

This proof-of-concept demonstrates potential applications:

**🔬 Concept Validation**
- Test different evaluation criteria and weightings
- Explore AI-assisted screening workflows
- Validate rule-based evaluation approaches
- Compare results across different AI providers

**📚 Learning & Research**  
- Study AI prompt engineering for HR applications
- Understand multi-provider LLM integration patterns
- Explore bias detection in automated screening
- Prototype evaluation algorithms

**🧪 Experimentation**
- Try different rule configurations with real resumes
- Test blacklist filtering effectiveness
- Compare AI reasoning across providers
- Validate scoring methodologies

## 🤝 Contributing

We welcome contributions to make this project even better:

**Development Setup**
```bash
git clone <repository-url>
cd resume_evaluator_demo
pnpm install
pnpm dev
```

**Areas for Contribution**
- 🎨 UI/UX improvements and new components
- 🤖 Additional AI provider integrations  
- 🧪 Test coverage and quality assurance
- 📚 Documentation and user guides
- 🔧 Performance optimizations

**Guidelines**
1. Follow existing TypeScript and React patterns
2. Ensure mobile responsiveness for all new components
3. Add comprehensive JSDoc comments for new functions
4. Test with multiple AI providers before submitting

## 📄 License

This project is currently under active development as a demonstration platform. Please contact the maintainers for licensing information regarding commercial use.

## 📋 Demo Status

**🎯 Current Version: 1.0.0-demo - Proof of Concept Complete**

✅ **Core Concept Validated** - Rule-based AI evaluation working  
✅ **Multi-Provider Support** - OpenAI, DeepSeek, and Qwen integration  
✅ **Functional UI** - Complete demo interface with shadcn/ui components  
✅ **Local Configuration** - Browser-based setup with localStorage  
✅ **Evaluation Engine** - Parallel processing and weighted scoring  
⚠️ **Demo Limitations** - Manual input only, no persistence, single-user  

**Purpose: Technical Demonstration** 🧪  
This is a proof-of-concept showcasing the feasibility of AI-powered resume evaluation. Production implementation would require significant additional development including database integration, automated workflows, and enterprise features.

---

*This demo validates the core technical approach. Production deployment would need substantial additional development.*
