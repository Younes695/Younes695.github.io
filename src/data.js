// All site content lives here. Adding a project = adding one object to `projects`.

export const profile = {
  name: "Abd-Elrahman Wael Younes",
  brandName: "Abd-Elrahman Wael",
  role: "AI Engineer",
  // The hero cycles through these after "I build".
  focus: ["RAG chatbots that cite sources", "machine learning models", "Arabic + English AI apps", "models served as APIs"],
  location: "Port Said, Egypt",
  email: "abdelrahmanwaelit@gmail.com",
  phone: "+20 100 505 6546",
  phoneLink: "tel:+201005056546",
  github: "https://github.com/Younes695",
  linkedin: "https://www.linkedin.com/in/abd-elrahman-wael-younes",
  photo: "/profile.webp",
  cv: "/Abd-Elrahman-Younes-CV.pdf",
  // GoatCounter site code (the part before .goatcounter.com). Empty = no analytics script.
  goatcounter: "younes",
  intro:
    "I build AI applications, from RAG chatbots that cite their sources to machine learning models, in Arabic and English. I ship them with tests and measured results.",
};

// Order here is the order of the icons in the hero and contact section.
export const socials = [
  { id: "github", label: "GitHub", href: "https://github.com/Younes695" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/abd-elrahman-wael-younes" },
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/201005056546" },
  { id: "telegram", label: "Telegram", href: "https://t.me/abdElrahmanWael51" },
  { id: "facebook", label: "Facebook", href: "https://www.facebook.com/abd.elrahman.younes.31123/" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/abdelrahmanyounes7" },
];

export const about = [
  "I'm an IT Management student at Port Said University (class of 2027) focused on AI engineering: machine learning, deep learning and generative AI.",
  "I completed a machine learning internship at Codveda, I'm working through the IBM AI Engineering Professional Certificate, and I trained as a DevOps specialist at ITI, so I can take a model from a notebook to a deployed service.",
  "I care about Arabic support done properly and about results you can check: every project here states how it was evaluated.",
];

export const skillGroups = [
  {
    id: "ml",
    label: "AI & Machine Learning",
    icon: "Brain",
    skills: ["PyTorch", "TensorFlow", "Keras", "Scikit-learn", "Feature Engineering", "Model Evaluation"],
  },
  {
    id: "genai",
    label: "GenAI & NLP",
    icon: "Sparkles",
    skills: ["LLMs", "RAG", "Embeddings & Vector Search", "Gemini API", "Transformers", "NLTK & Gensim", "Arabic NLP"],
  },
  {
    id: "data",
    label: "Data",
    icon: "Database",
    skills: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "SQL", "Data Visualization"],
  },
  {
    id: "apps",
    label: "Backend & Apps",
    icon: "Server",
    skills: ["Python", "FastAPI", "Streamlit", "REST APIs", "C++"],
  },
  {
    id: "devops",
    label: "DevOps & MLOps",
    icon: "Container",
    skills: ["Docker", "Kubernetes", "CI/CD", "AWS Fundamentals", "Linux", "Git & GitHub"],
  },
];

// `category` drives the filter chips. `image` is optional: without it the card shows a cover.
// `imageType: "screenshot"` fills the frame; other images (charts) are shown whole on white.
export const projects = [
  {
    id: "arabic-rag",
    title: "Arabic + English Document Chatbot",
    category: "GenAI",
    featured: true,
    summary:
      "Ask questions about your PDFs and get answers that cite the file and page. It says “not found” instead of guessing, and it fixes Arabic PDF text where numbers come out reversed.",
    result: "24/24 answers correct and cited, 4/4 refusals on the sample set",
    tags: ["Gemini", "RAG", "BM25 + Embeddings", "Streamlit", "Arabic NLP"],
    image: "/projects/arabic-rag.webp",
    imageType: "screenshot",
    github: "https://github.com/Younes695/arabic-rag-chatbot",
  },
  {
    id: "codveda",
    title: "Codveda ML Internship",
    category: "Machine Learning",
    summary:
      "Internship tasks across the ML pipeline: data cleaning, house price regression, customer churn classification and customer segmentation with K-Means and PCA.",
    result: "Level 2 of 3 completed",
    tags: ["Scikit-learn", "Logistic Regression", "K-Means", "PCA"],
    image: "/projects/codveda.png",
    github: "https://github.com/Younes695/Codveda-ML-Internship",
  },
  {
    id: "car-price",
    title: "Car Price Prediction",
    category: "Machine Learning",
    summary:
      "Predicts used-car selling prices and compares linear, polynomial, ridge and lasso regression on R², with feature correlation analysis.",
    result: "4 regression models compared on R²",
    tags: ["Regression", "Feature Engineering", "Scikit-learn"],
    image: "/projects/car-price.png",
    github: "https://github.com/Younes695/Car-Price-Prediction",
  },
  {
    id: "breast-cancer",
    title: "Breast Cancer Classification (ANN)",
    category: "Deep Learning",
    summary:
      "A neural network that classifies tumors as benign or malignant on the Wisconsin dataset, evaluated with accuracy, a confusion matrix and the ROC curve.",
    result: "Evaluated with confusion matrix and ROC curve",
    tags: ["TensorFlow", "Keras", "ANN"],
    image: "/projects/breast-cancer.png",
    github: "https://github.com/Younes695/Breast-Cancer-Classification-ANN",
  },
  {
    id: "ibm-nlp",
    title: "NLP Foundations with PyTorch (IBM)",
    category: "NLP",
    summary:
      "Hands-on labs: document classification, n-gram language models, Word2Vec with t-SNE, and a Seq2Seq LSTM translator evaluated with BLEU and perplexity.",
    result: "IBM course 8 of 13, completed Sep 2026",
    tags: ["PyTorch", "Word2Vec", "Seq2Seq", "BLEU"],
    cover: "BookOpen",
    github: "https://github.com/Younes695/GenAI-NLP-Foundations-IBM",
  },
];

export const services = [
  {
    icon: "MessagesSquare",
    title: "Document chatbots (RAG)",
    text: "A chatbot that answers from your PDFs and policies, cites the page, and says when it doesn't know. Arabic and English.",
  },
  {
    icon: "FileSearch",
    title: "Data extraction from documents",
    text: "Turn invoices, forms and reports into structured data in Excel or your database, using LLMs with a fixed schema.",
  },
  {
    icon: "LineChart",
    title: "Machine learning models",
    text: "Prediction and classification models built on your data, with a clear evaluation you can check.",
  },
  {
    icon: "Rocket",
    title: "Deploying models",
    text: "Wrap a model in a FastAPI service with Docker so your team or app can call it.",
  },
];

export const experience = [
  {
    when: "Aug 2026",
    title: "AI Hackathon Participant",
    org: "Orange Digital Center Egypt × Creativa",
    text: "5-day team hackathon: built a RAG medical assistant with cited answers and case triage, in a team of three.",
  },
  {
    when: "Aug 2026",
    title: "DevOps Specialist Training",
    org: "Information Technology Institute (ITI)",
    text: "123 hours on Docker, Kubernetes, CI/CD pipelines and AWS fundamentals.",
  },
  {
    when: "Jan 2026",
    title: "Machine Learning Intern",
    org: "Codveda Technologies",
    text: "Built, trained and evaluated ML models on real-world datasets; completed Level 2.",
  },
  {
    when: "Jul 2025",
    title: "IT Intern",
    org: "Suez Canal Container Terminal",
    text: "Enterprise IT systems and operations in a large-scale logistics company.",
  },
  {
    when: "2023 – 2024",
    title: "ICPC Contestant",
    org: "International Collegiate Programming Contest",
    text: "Algorithmic problem solving in a team, reaching Junior level.",
  },
];

export const education = {
  degree: "B.Sc. in Information Technology Management",
  school: "Port Said University, Faculty of Management Technology and Information Systems",
  when: "2023 – 2027 (expected)",
  note: "GPA 3.61",
};

export const certifications = [
  { name: "Gen AI Foundational Models for NLP & Language Understanding", issuer: "IBM · Coursera", when: "Sep 2026" },
  { name: "Generative AI and LLMs: Architecture and Data Preparation", issuer: "IBM · Coursera", when: "Aug 2026" },
  { name: "AI Capstone Project with Deep Learning", issuer: "IBM · Coursera", when: "Aug 2026" },
  { name: "Deep Learning with PyTorch", issuer: "IBM · Coursera", when: "Aug 2026" },
  { name: "DevOps Specialist Training (123 hrs)", issuer: "ITI", when: "Aug 2026" },
  { name: "Deep Learning A-Z: DL, AI in Python & AWS", issuer: "Udemy", when: "Jul 2026" },
  { name: "Data Analysis: Skills for Freelance Professionals (score 93%)", issuer: "Digital Egypt Youth · MCIT / NTI", when: "Mar 2026" },
  { name: "CS50: Introduction to Computer Science", issuer: "Harvard University", when: "" },
];
