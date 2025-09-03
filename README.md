# AI Resume Evaluator Demo

A proof-of-concept application demonstrating AI-powered resume evaluation capabilities. This demo showcases how LLM technology can be used to create customizable resume screening workflows with **dual evaluation approaches** - both rule-based scoring and custom prompt-based evaluation.

## 🎯 Project Purpose

This is a **demonstration project** built to explore and validate the concept of AI-assisted resume evaluation. It serves as a technical proof-of-concept for:

- **Dual Evaluation Approaches**: Rule-based scoring (Approach A) and custom prompt evaluation (Approach B)
- **Rule-Based Evaluation**: Custom scoring criteria with weighted importance and blacklist filtering
- **Custom Prompt Evaluation**: System/user prompt-based evaluation with flexible scoring
- **Multi-Provider LLM Integration**: Support for different AI providers (OpenAI, DeepSeek, Qwen)
- **Parallel Processing**: Efficient evaluation of multiple rules and dual approach comparison
- **Interactive UI**: Real-time configuration and side-by-side evaluation results

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

**🎛️ Dual Rule Management Interface**
- **Approach A (Rule-Based)**: Define evaluation criteria with descriptions and weights
- **Approach B (Prompt-Based)**: Configure custom system and user prompts
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

**⚡ Dual Evaluation Engine**
- **Approach A**: Rule-based evaluation with parallel processing and weighted scoring
- **Approach B**: Single-call evaluation using custom system/user prompts
- **Simultaneous Execution**: Run both approaches in parallel for comparison
- **Structured Prompts**: Role-specific prompts for different rule types
- **Flexible Scoring**: Support for both weighted rule scoring and custom scoring formats
- **Detailed Breakdown**: Shows individual rule scores and reasoning from both approaches

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
│   ├── api/v1/
│   │   ├── evaluate/      # REST API for Approach A (rule-based) evaluation
│   │   └── evaluate-b/    # REST API for Approach B (prompt-based) evaluation
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main application interface
│
├── components/
│   ├── forms/             # Input and result components
│   │   ├── jd-input.tsx          # Job description textarea
│   │   ├── resume-input.tsx      # Resume content textarea  
│   │   ├── action-buttons.tsx    # Dual evaluation triggers
│   │   └── evaluation-result.tsx # Tabbed results display with comparison
│   ├── header/            # Application header
│   │   ├── header.tsx            # Main navigation
│   │   └── key-config-modal.tsx  # API configuration dialog
│   ├── rules/             # Approach A rule management
│   │   ├── evaluation-rules.tsx  # Rating rule builder
│   │   ├── blacklist.tsx         # Blacklist configuration
│   │   └── ruleset.tsx           # Combined rule interface
│   ├── rules_2/           # Approach B prompt management
│   │   └── ruleset_2.tsx         # System/user prompt configuration
│   └── ui/                # Reusable Radix UI components
│
├── lib/
│   ├── hooks/             # Custom React hooks
│   │   ├── useConfig.ts          # API configuration management
│   │   ├── useEvaluation.ts      # Approach A state management
│   │   ├── useEvaluationB.ts     # Approach B state management
│   │   └── useInputs.tsx         # Form input management
│   ├── functions/
│   │   └── storage.ts            # localStorage utilities (includes Ruleset2Data)
│   └── llm/               # AI integration layer
│       ├── core/
│       │   ├── client.ts         # Evaluation client class
│       │   ├── evaluator.ts      # Approach A evaluation engine
│       │   └── evaluator_b.ts    # Approach B evaluation engine
│       ├── prompts/              # AI prompt management
│       │   ├── system_prompt.ts  # System message templates
│       │   ├── user_prompt_template.ts # Dynamic user prompts
│       │   └── schema_evaluator.ts # Response schemas
│       └── providers/            # Multi-provider architecture
│           ├── base.ts           # Abstract provider interface
│           ├── openai.ts         # OpenAI implementation
│           ├── deepseek.ts       # DeepSeek implementation
│           ├── qwen.ts           # Qwen implementation
│           ├── factory.ts        # Provider factory
│           └── types.ts          # Type definitions
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
   - Paste a job description and resume
   - Choose your evaluation method:
     - **"Approach A"**: Rule-based evaluation with weighted scoring
     - **"Approach B"**: Custom prompt-based evaluation  
     - **"Both"**: Run both approaches simultaneously for comparison
   - Review detailed scoring and reasoning from your chosen approach(es)

## 📖 User Guide

### 🎛️ Setting Up Evaluation Rules

## Approach A: Rule-Based Evaluation

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

## Approach B: Custom Prompt Evaluation

**Configure System/User Prompts**
1. Navigate to the "Rules [Approach B]" section
2. Click the "Edit" button to modify prompts
3. Define your **System Prompt** - sets the AI's role and behavior
4. Define your **User Prompt** - provides the evaluation instructions

**System Prompt Best Practices**
- Define the AI's role (e.g., "You are an expert HR recruiter")
- Set the evaluation context and standards
- Specify the required response format
- Include any behavioral guidelines

**User Prompt Configuration**
- Use placeholders `{resume}` and `{jobDescription}` for dynamic content
- Provide clear evaluation criteria
- Specify scoring methodology
- Include examples of desired output format

**Required Response Format for Approach B**
```json
{
  "totalScore": 4.25,
  "reasons": [
    {
      "item": "Technical Skills",
      "score": 4.5,
      "reason": "Strong match with required technologies"
    },
    {
      "item": "Experience Level",
      "score": 4.0,
      "reason": "Solid background in relevant domains"
    }
  ]
}
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

## Approach A Results (Rule-Based)

**Overall Score**
- Percentage score (0-100%) based on weighted rule evaluation
- Final score calculation: `(sum of weighted scores) / 5 * 100`
- Instant disqualification if blacklist criteria are met

**Detailed Breakdown**
- **Blacklist Results**: Shows which filters triggered (if any)
- **Rating Results**: Individual rule scores with AI reasoning
- **Metadata**: Provider, model, execution time, timestamp

## Approach B Results (Prompt-Based)

**Total Score**
- Flexible scoring based on your custom prompt instructions
- Score format determined by your system prompt configuration
- Raw AI reasoning for each evaluation aspect

**Structured Response**
- **Total Score**: Overall evaluation score
- **Reasons Array**: Individual aspects with scores and explanations
- **Summary Statistics**: Average, min, max scores and aspect count
- **Metadata**: Provider, model, execution time, timestamp

## Comparative Analysis

When running both approaches simultaneously, you can:
- **Compare Scoring Methods**: See how rule-based vs. prompt-based evaluation differ
- **Validate Consistency**: Check if both approaches reach similar conclusions
- **Optimize Prompts**: Use Approach A results to refine Approach B prompts
- **Method Selection**: Determine which approach works better for your use case

**Score Interpretation**
```
90-100%  │ Excellent match
80-89%   │ Strong candidate  
70-79%   │ Good fit
60-69%   │ Adequate match
Below 60%│ Poor fit
```

## 🚀 Advanced Features

### ⚡ Dual Evaluation Architecture

The application supports two distinct evaluation methodologies:

**Approach A: Rule-Based Parallel Processing**
```
Traditional Sequential:  
Rule 1 → Rule 2 → Rule 3 → Rule 4  (16 seconds)

Our Parallel Processing:
Rule 1 ┐
Rule 2 ├─→ Combined Result  (4 seconds)  
Rule 3 ┤
Rule 4 ┘
```

**Approach B: Single-Call Custom Evaluation**
```
System Prompt + User Prompt → Single LLM Call → Structured Result
```

**Simultaneous Comparison**
```
Input ─┬─→ Approach A (Rule-based) ─┬─→ Comparative Analysis
       └─→ Approach B (Prompt-based) ─┘
```

### 🧠 Intelligent Prompt Engineering

**Approach A: Specialized System Prompts**
- **Rating Rules**: Optimized for 0-5 scoring with detailed reasoning
- **Blacklist Rules**: Binary qualification/disqualification logic
- **Context Injection**: Resume and job description automatically included

**Approach A: Dynamic User Prompts**
- Rule-specific formatting based on evaluation type
- Global context access for consistent evaluation
- Provider-optimized templates (OpenAI vs Qwen format differences)

**Approach B: Custom Prompt System**
- **System Prompt**: Define AI role, behavior, and response format
- **User Prompt**: Provide evaluation criteria with placeholder substitution
- **Flexible Scoring**: Adapts to any scoring methodology you define
- **Template Variables**: Auto-replace `{resume}` and `{jobDescription}` placeholders

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
- **Dual Approach Testing**: Compare rule-based vs. prompt-based evaluation methods
- Test different evaluation criteria and weightings
- Explore AI-assisted screening workflows
- Validate both structured and flexible evaluation approaches
- Compare results across different AI providers

**📚 Learning & Research**  
- **Prompt Engineering Studies**: Compare structured rules vs. custom prompts
- Study AI prompt engineering for HR applications
- Understand multi-provider LLM integration patterns
- Explore bias detection in automated screening
- Prototype evaluation algorithms and scoring methodologies

**🧪 Experimentation**
- **Approach A Experiments**: Try different rule configurations and weights
- **Approach B Experiments**: Test various system/user prompt combinations
- **Comparative Analysis**: Run both approaches on the same resumes
- Test blacklist filtering effectiveness
- Compare AI reasoning patterns across providers
- Validate scoring consistency between methods

**🎯 Method Optimization**
- **Rule Refinement**: Use Approach B results to improve Approach A rules
- **Prompt Optimization**: Use Approach A structure to enhance Approach B prompts
- **Hybrid Strategies**: Develop evaluation workflows combining both approaches
- **Performance Tuning**: Compare execution time and accuracy between methods

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

**🎯 Current Version: 2.0.0-demo - Dual Approach Implementation Complete**

✅ **Dual Evaluation System** - Both rule-based and prompt-based evaluation working  
✅ **Approach A (Rule-Based)** - Parallel processing with weighted scoring and blacklist filtering  
✅ **Approach B (Prompt-Based)** - Custom system/user prompt evaluation with flexible scoring  
✅ **Simultaneous Comparison** - Run both approaches in parallel for analysis  
✅ **Multi-Provider Support** - OpenAI, DeepSeek, and Qwen integration for both approaches  
✅ **Enhanced UI** - Tabbed results display with comparative analysis  
✅ **Local Configuration** - Browser-based setup with localStorage for both approaches  
⚠️ **Demo Limitations** - Manual input only, no persistence, single-user  

**Purpose: Dual Method Technical Demonstration** 🧪  
This proof-of-concept showcases the feasibility of **both structured rule-based and flexible prompt-based** AI-powered resume evaluation. It demonstrates how different evaluation methodologies can be implemented and compared within the same system. Production implementation would require significant additional development including database integration, automated workflows, and enterprise features.

---

*This demo validates the core technical approach. Production deployment would need substantial additional development.*
