interface PortfolioData {
  name?: string;
  email?: string;
  location?: string;
  professionalTitle?: string;
  phone?: string;
  avatar?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  social?: {
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  summary?: string;
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  skills?: string[];
  projects?: Array<{
    title: string;
    description: string;
    technologies?: string;
  }>;
}

interface CustomElement {
  id: string;
  type: string;
  props?: any;
  section?: string;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function renderCustomElementHTML(element: CustomElement): string {
  const { type, props = {} } = element;
  
  if (type === 'wizard') {
    const steps = props.steps || 3;
    const currentStep = props.currentStep || 1;
    let wizardHTML = '<div class="custom-element wizard"><div class="wizard-container">';
    
    for (let i = 0; i < steps; i++) {
      const stepNum = i + 1;
      const isActive = stepNum === currentStep;
      const isCompleted = stepNum < currentStep;
      
      wizardHTML += '<div class="wizard-step-wrapper">';
      wizardHTML += '<div class="wizard-step">';
      wizardHTML += `<div class="wizard-circle ${isCompleted ? 'completed' : isActive ? 'active' : ''}">`;
      wizardHTML += isCompleted ? '<span class="wizard-check">✓</span>' : `<span class="wizard-number">${stepNum}</span>`;
      wizardHTML += '</div>';
      wizardHTML += `<span class="wizard-label ${isActive || isCompleted ? 'active' : ''}">Step ${stepNum}</span>`;
      wizardHTML += '</div></div>';
      
      if (i < steps - 1) {
        wizardHTML += `<div class="wizard-connector ${isCompleted ? 'completed' : ''}"></div>`;
      }
    }
    
    wizardHTML += '</div></div>';
    return wizardHTML;
  }
  
  if (type === 'steps') {
    const items = props.items || ['Step 1', 'Step 2', 'Step 3'];
    let stepsHTML = '<div class="custom-element steps"><div class="steps-container">';
    
    items.forEach((item: string, index: number) => {
      stepsHTML += '<div class="step-item">';
      stepsHTML += `<div class="step-number">${index + 1}</div>`;
      stepsHTML += `<div class="step-content">${escapeHtml(item)}</div>`;
      stepsHTML += '</div>';
    });
    
    stepsHTML += '</div></div>';
    return stepsHTML;
  }
  
  if (type === 'timeline') {
    const items = props.items || ['Event 1', 'Event 2', 'Event 3'];
    let timelineHTML = '<div class="custom-element timeline"><div class="timeline-wrapper">';
    timelineHTML += '<div class="timeline-line"></div>';
    timelineHTML += '<div class="timeline-items">';
    
    items.forEach((item: string) => {
      timelineHTML += '<div class="timeline-item">';
      timelineHTML += '<div class="timeline-dot"></div>';
      timelineHTML += `<div class="timeline-content">${escapeHtml(item)}</div>`;
      timelineHTML += '</div>';
    });
    
    timelineHTML += '</div></div></div>';
    return timelineHTML;
  }
  
  if (type === 'stats') {
    const stats = props.stats || [
      { label: 'Projects', value: '50+' },
      { label: 'Clients', value: '30+' },
      { label: 'Experience', value: '5y' }
    ];
    let statsHTML = '<div class="custom-element stats"><div class="stats-grid">';
    
    stats.forEach((stat: { label: string; value: string }) => {
      statsHTML += '<div class="stat-item">';
      statsHTML += `<div class="stat-value">${escapeHtml(stat.value)}</div>`;
      statsHTML += `<div class="stat-label">${escapeHtml(stat.label)}</div>`;
      statsHTML += '</div>';
    });
    
    statsHTML += '</div></div>';
    return statsHTML;
  }
  
  if (type === 'achievements') {
    const items = props.items || ['Achievement 1', 'Achievement 2', 'Achievement 3'];
    let achievementsHTML = '<div class="custom-element achievements"><div class="achievements-list">';
    
    items.forEach((item: string) => {
      achievementsHTML += '<div class="achievement-item">';
      achievementsHTML += '<span class="achievement-icon">🏆</span>';
      achievementsHTML += `<span class="achievement-text">${escapeHtml(item)}</span>`;
      achievementsHTML += '</div>';
    });
    
    achievementsHTML += '</div></div>';
    return achievementsHTML;
  }
  
  if (type === 'progress') {
    const items = props.items || [
      { label: 'Skill 1', progress: 90 },
      { label: 'Skill 2', progress: 75 },
      { label: 'Skill 3', progress: 60 }
    ];
    let progressHTML = '<div class="custom-element progress"><div class="progress-list">';
    
    items.forEach((item: { label: string; progress: number }) => {
      progressHTML += '<div class="progress-item">';
      progressHTML += '<div class="progress-header">';
      progressHTML += `<span class="progress-label">${escapeHtml(item.label)}</span>`;
      progressHTML += `<span class="progress-percent">${item.progress}%</span>`;
      progressHTML += '</div>';
      progressHTML += '<div class="progress-bar">';
      progressHTML += `<div class="progress-fill" style="width: ${item.progress}%"></div>`;
      progressHTML += '</div>';
      progressHTML += '</div>';
    });
    
    progressHTML += '</div></div>';
    return progressHTML;
  }
  
  return '';
}

function getCustomElementsForSection(customElements: CustomElement[], sectionId: string): CustomElement[] {
  return customElements.filter(el => el.section === sectionId);
}

export function generatePortfolioHTML(data: PortfolioData, customElements: CustomElement[] = []): string {
  const portfolioName = data.name || 'Portfolio';
  const githubLink = (data.social?.github || data.githubUrl || '').trim();
  const linkedinLink = (data.linkedinUrl || '').trim();
  
  // Generate custom elements HTML for each section
  const heroElements = getCustomElementsForSection(customElements, 'hero').map(el => renderCustomElementHTML(el)).join('');
  const aboutElements = getCustomElementsForSection(customElements, 'about').map(el => renderCustomElementHTML(el)).join('');
  const experienceElements = getCustomElementsForSection(customElements, 'experience').map(el => renderCustomElementHTML(el)).join('');
  const projectsElements = getCustomElementsForSection(customElements, 'projects').map(el => renderCustomElementHTML(el)).join('');
  const skillsElements = getCustomElementsForSection(customElements, 'skills').map(el => renderCustomElementHTML(el)).join('');
  const educationElements = getCustomElementsForSection(customElements, 'education').map(el => renderCustomElementHTML(el)).join('');
  const contactElements = getCustomElementsForSection(customElements, 'contact').map(el => renderCustomElementHTML(el)).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(portfolioName)} - Portfolio</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #111827;
      background: #ffffff;
    }
    
    header {
      position: sticky;
      top: 0;
      z-index: 40;
      width: 100%;
      border-bottom: 1px solid #e5e7eb;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(8px);
    }
    
    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    
    nav {
      display: flex;
      height: 5rem;
      align-items: center;
      justify-content: space-between;
    }
    
    nav a {
      text-decoration: none;
      color: #374151;
      font-weight: 500;
      font-size: 1rem;
      transition: color 0.2s;
    }
    
    nav a:hover {
      color: #2563eb;
    }
    
    main {
      padding: 2.5rem 1.5rem;
    }
    
    section {
      padding: 4rem 0;
      scroll-margin-top: 5rem;
    }
    
    h1 {
      font-size: 3rem;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1rem;
    }
    
    h2 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 2rem;
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .hero {
      padding: 4rem 0;
    }
    
    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
    }
    
    @media (min-width: 768px) {
      .hero-content {
        flex-direction: row;
        align-items: center;
      }
    }
    
    .hero-text {
      flex: 2;
    }
    
    .hero-avatar {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    
    .avatar {
      width: 12rem;
      height: 12rem;
      border-radius: 9999px;
      border: 4px solid rgba(37, 99, 235, 0.2);
      object-fit: cover;
    }
    
    .avatar-fallback {
      width: 12rem;
      height: 12rem;
      border-radius: 9999px;
      border: 4px solid rgba(37, 99, 235, 0.2);
      background: #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: #6b7280;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.625rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .btn-primary {
      background: #000;
      color: #fff;
    }
    
    .btn-primary:hover {
      background: rgba(0, 0, 0, 0.9);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .btn-outline {
      border: 1px solid #d1d5db;
      background: transparent;
      color: #111827;
    }
    
    .btn-outline:hover {
      background: #f9fafb;
    }
    
    .card {
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
      background: #fff;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .badge {
      display: inline-flex;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      color: #111827;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .section-divider {
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }
    
    .social-links {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .social-btn {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      border: 1px solid #d1d5db;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .social-btn:hover {
      background: #f9fafb;
      transform: scale(1.1);
    }
    
    /* Custom Elements Styles */
    .custom-element {
      margin: 1.5rem 0;
      padding: 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
      background: #fff;
    }
    
    /* Wizard Styles */
    .wizard-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 42rem;
      margin: 0 auto;
    }
    
    .wizard-step-wrapper {
      display: flex;
      align-items: center;
      flex: 1;
    }
    
    .wizard-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }
    
    .wizard-circle {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #d1d5db;
      background: #f9fafb;
      color: #9ca3af;
      font-weight: 600;
      font-size: 0.875rem;
    }
    
    .wizard-circle.completed {
      background: #2563eb;
      border-color: #2563eb;
      color: #fff;
    }
    
    .wizard-circle.active {
      background: #dbeafe;
      border-color: #2563eb;
      color: #2563eb;
    }
    
    .wizard-check {
      color: #fff;
      font-size: 0.875rem;
    }
    
    .wizard-label {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: #9ca3af;
    }
    
    .wizard-label.active {
      color: #2563eb;
    }
    
    .wizard-connector {
      flex: 1;
      height: 2px;
      margin: 0 0.5rem;
      background: #e5e7eb;
    }
    
    .wizard-connector.completed {
      background: #2563eb;
    }
    
    /* Steps Styles */
    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .step-number {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      border-radius: 9999px;
      background: #2563eb;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
    }
    
    .step-content {
      flex: 1;
      padding-top: 0.25rem;
      font-size: 1rem;
      font-weight: 500;
      color: #111827;
    }
    
    /* Timeline Styles */
    .timeline-wrapper {
      position: relative;
    }
    
    .timeline-line {
      position: absolute;
      left: 1rem;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e5e7eb;
    }
    
    .timeline-items {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .timeline-item {
      position: relative;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .timeline-dot {
      position: relative;
      z-index: 10;
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      border-radius: 9999px;
      background: #2563eb;
      border: 4px solid #fff;
    }
    
    .timeline-content {
      flex: 1;
      padding-top: 0.25rem;
      font-size: 1rem;
      font-weight: 500;
      color: #111827;
    }
    
    /* Stats Styles */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      text-align: center;
    }
    
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    
    .stat-value {
      font-size: 1.875rem;
      font-weight: 700;
      color: #2563eb;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    /* Achievements Styles */
    .achievements-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .achievement-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .achievement-icon {
      font-size: 1.25rem;
      color: #2563eb;
    }
    
    .achievement-text {
      font-size: 1rem;
      color: #111827;
    }
    
    /* Progress Styles */
    .progress-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .progress-item {
      display: flex;
      flex-direction: column;
    }
    
    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .progress-label {
      color: #111827;
    }
    
    .progress-percent {
      color: #6b7280;
    }
    
    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background: #2563eb;
      transition: width 0.5s;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .skill-card {
      border-radius: 0.5rem;
      border: 2px solid #e5e7eb;
      background: #fff;
      padding: 1rem 1.25rem;
      text-align: center;
      transition: all 0.3s;
    }
    
    .skill-card:hover {
      border-color: #2563eb;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    /* Theme Toggle */
    .theme-toggle {
      border: 1px solid #d1d5db;
      background: rgba(0, 0, 0, 0.05);
      color: #111827;
      border-radius: 9999px;
      padding: 0.45rem 0.9rem;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    /* Dark mode overrides */
    body.dark {
      color: #f3f4f6;
      background: #0a0a0a;
    }

    body.dark header {
      background: rgba(10, 10, 10, 0.92);
      border-color: #1f2937;
    }

    body.dark nav a {
      color: #d1d5db;
    }

    body.dark nav a:hover {
      color: #60a5fa;
    }

    body.dark .theme-toggle {
      border-color: #374151;
      background: rgba(255, 255, 255, 0.1);
      color: #f3f4f6;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);
    }

    body.dark .card,
    body.dark .custom-element,
    body.dark .skill-card {
      background: #111827;
      border-color: #1f2937;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
    }

    body.dark .badge,
    body.dark .social-btn {
      border-color: #374151;
      background: #1f2937;
      color: #f3f4f6;
    }

    body.dark .avatar-fallback {
      background: #1f2937;
      border-color: rgba(96, 165, 250, 0.25);
      color: #d1d5db;
    }

    body.dark .wizard-circle {
      border-color: #374151;
      background: #1f2937;
      color: #9ca3af;
    }

    body.dark .wizard-circle.completed {
      background: #60a5fa;
      border-color: #60a5fa;
      color: #0f172a;
    }

    body.dark .wizard-circle.active {
      background: rgba(96, 165, 250, 0.2);
      border-color: #60a5fa;
      color: #60a5fa;
    }

    body.dark .wizard-label {
      color: #9ca3af;
    }

    body.dark .wizard-label.active {
      color: #60a5fa;
    }

    body.dark .wizard-connector {
      background: #1f2937;
    }

    body.dark .wizard-connector.completed {
      background: #60a5fa;
    }

    body.dark .timeline-line {
      background: #1f2937;
    }

    body.dark .timeline-dot {
      background: #60a5fa;
      border-color: #0a0a0a;
    }

    body.dark .stat-value {
      color: #60a5fa;
    }

    body.dark .stat-label,
    body.dark .progress-percent,
    body.dark .step-content,
    body.dark p,
    body.dark span {
      color: #d1d5db;
    }

    body.dark .achievement-text {
      color: #f3f4f6;
    }

    body.dark .progress-bar {
      background: #1f2937;
    }

    body.dark .progress-fill {
      background: #60a5fa;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 2.25rem;
      }
      
      h2 {
        font-size: 2rem;
      }
      
      nav {
        flex-wrap: wrap;
        height: auto;
        padding: 1rem 0;
      }
      
      nav > div:first-child {
        width: 100%;
        margin-bottom: 1rem;
      }
      
      .stats-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }
      
      .hero-content {
        flex-direction: column;
      }
    }
  </style>
</head>
<body class="dark">
  <header>
    <nav class="container">
      <div>
        <span style="font-size: 1.5rem; font-weight: 700;">${escapeHtml(portfolioName)}</span>
      </div>
      <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; justify-content: flex-end;">
        <button class="theme-toggle" id="themeToggle">Light Mode</button>
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#education">Education</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  </header>
  
  <main class="container">
    <section class="hero" id="hero">
      ${heroElements}
      <div class="hero-content">
        <div class="hero-text">
          <h1>Hi, I'm <span style="color: #2563eb;">${escapeHtml(data.name || 'Your Name')}</span></h1>
          <h2 style="font-size: 2rem; font-weight: 600; color: #6b7280; margin-bottom: 1rem;">
            ${escapeHtml(data.professionalTitle || 'Professional')}
          </h2>
          <p style="font-size: 1.25rem; color: #6b7280; max-width: 48rem; margin-bottom: 2rem; line-height: 1.75;">
            ${escapeHtml(data.summary || 'A passionate professional with a drive to explore new technologies.')}
          </p>
          <div style="display: flex; flex-wrap: gap: 1rem; margin-bottom: 1.5rem;">
            <a href="#contact" class="btn btn-primary">Get in Touch</a>
            <a href="#projects" class="btn btn-outline">View Projects</a>
          </div>
          <div class="social-links">
            ${githubLink ? `<a href="${escapeHtml(githubLink)}" target="_blank" rel="noopener noreferrer" class="social-btn">GitHub</a>` : ''}
            ${linkedinLink ? `<a href="${escapeHtml(linkedinLink)}" target="_blank" rel="noopener noreferrer" class="social-btn">LinkedIn</a>` : ''}
            ${data.email ? `<a href="mailto:${escapeHtml(data.email)}" class="social-btn">Email</a>` : ''}
          </div>
        </div>
        <div class="hero-avatar">
          ${data.avatar ? `<img src="${escapeHtml(data.avatar)}" alt="${escapeHtml(data.name || 'Profile')}" class="avatar" />` : `<div class="avatar-fallback">${(data.name || 'U').charAt(0).toUpperCase()}</div>`}
        </div>
      </div>
    </section>
    
    <section id="about">
      ${aboutElements}
      <div class="section-header">
        <h2>About Me</h2>
        <div class="section-divider"></div>
      </div>
      <div class="card">
        <p style="font-size: 1.125rem; margin-bottom: 1rem; line-height: 1.75;">
          ${escapeHtml(data.summary || 'Professional summary...')}
        </p>
        ${data.skills && data.skills.length > 0 ? `
          <div style="margin-top: 1.5rem;">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem;">What I'm good at</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
              ${data.skills.map((skill: string) => `<span class="badge">${escapeHtml(skill)}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </section>
    
    ${data.experience && data.experience.length > 0 ? `
      <section id="experience">
        ${experienceElements}
        <div class="section-header">
          <h2>Work Experience</h2>
          <div class="section-divider"></div>
        </div>
        ${data.experience.map((exp: any) => `
          <div class="card">
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
              <h3>
                <span style="color: #2563eb;">${escapeHtml(exp.title)}</span> at <span style="font-weight: 600;">${escapeHtml(exp.company)}</span>
              </h3>
              <span class="badge">${escapeHtml(exp.duration)}</span>
            </div>
            <p style="color: #6b7280; line-height: 1.75;">${escapeHtml(exp.description)}</p>
          </div>
        `).join('')}
      </section>
    ` : ''}
    
    ${data.projects && data.projects.length > 0 ? `
      <section id="projects">
        ${projectsElements}
        <div class="section-header">
          <h2>Projects</h2>
          <div class="section-divider"></div>
        </div>
        <div class="projects-grid">
          ${data.projects.map((project: any) => `
            <div class="card">
              <h3 style="margin-bottom: 0.5rem;">${escapeHtml(project.title)}</h3>
              <p style="color: #6b7280; margin-bottom: 1rem; line-height: 1.75;">${escapeHtml(project.description)}</p>
              ${project.technologies ? `
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                  ${project.technologies.split(',').map((tech: string) => `<span class="badge">${escapeHtml(tech.trim())}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}
    
    ${data.skills && data.skills.length > 0 ? `
      <section id="skills">
        ${skillsElements}
        <div class="section-header">
          <h2>Technical Skills</h2>
          <div class="section-divider"></div>
        </div>
        <div class="skills-grid">
          ${data.skills.map((skill: string) => `
            <div class="skill-card">
              <span style="font-weight: 600; font-size: 1rem;">${escapeHtml(skill)}</span>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}
    
    ${data.education && data.education.length > 0 ? `
      <section id="education">
        ${educationElements}
        <div class="section-header">
          <h2>Education</h2>
          <div class="section-divider"></div>
        </div>
        ${data.education.map((edu: any) => `
          <div class="card">
            <h3 style="margin-bottom: 0.5rem;">${escapeHtml(edu.institution || 'Institution')}</h3>
            <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(edu.degree || 'Degree')}</p>
            ${edu.year ? `<span class="badge">${escapeHtml(edu.year)}</span>` : ''}
          </div>
        `).join('')}
      </section>
    ` : ''}
    
    <section id="contact">
      ${contactElements}
      <div class="section-header">
        <h2>Get In Touch</h2>
        <div class="section-divider"></div>
      </div>
      <div class="card">
        ${data.email ? `
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="font-weight: 600; font-size: 1.125rem;">Email</span>
            <a href="mailto:${escapeHtml(data.email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(data.email)}</a>
          </div>
        ` : ''}
        ${data.phone ? `
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <span style="font-weight: 600; font-size: 1.125rem;">Phone</span>
            <span>${escapeHtml(data.phone)}</span>
          </div>
        ` : ''}
        ${data.location ? `
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-weight: 600; font-size: 1.125rem;">Location</span>
            <span>${escapeHtml(data.location)}</span>
          </div>
        ` : ''}
        ${(githubLink || linkedinLink) ? `
          <div style="margin-top: 1.5rem;">
            <p style="font-weight: 600; font-size: 1.125rem; margin-bottom: 1rem;">Social Profiles</p>
            <div class="social-links">
              ${githubLink ? `<a href="${escapeHtml(githubLink)}" target="_blank" rel="noopener noreferrer" class="social-btn">GitHub</a>` : ''}
              ${linkedinLink ? `<a href="${escapeHtml(linkedinLink)}" target="_blank" rel="noopener noreferrer" class="social-btn">LinkedIn</a>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </section>
</main>
<script>
(function() {
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('portfolio_theme');
  if (savedTheme === 'light') {
    body.classList.remove('dark');
  }

  function updateToggleLabel() {
    if (!toggle) return;
    toggle.textContent = body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
  }

  updateToggleLabel();

  toggle?.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('portfolio_theme', body.classList.contains('dark') ? 'dark' : 'light');
    updateToggleLabel();
  });
})();
</script>
</body>
</html>`;
}

export function downloadPortfolioHTML(data: PortfolioData, customElements: CustomElement[] = []) {
  const html = generatePortfolioHTML(data, customElements);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(data.name || 'portfolio').toLowerCase().replace(/\s+/g, '-')}-portfolio.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

