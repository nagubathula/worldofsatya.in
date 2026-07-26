export const caseStudiesData = [
  {
    slug: "zero-cost-automation",
    title: "Zero-Cost Automation",
    type: "Architecture Breakdown",
    heroDescription: "Building an internal productivity suite using Google Colab, Supabase, and lightweight web extensions without spending a dime on infrastructure.",
    content: [
      {
        section: "The Problem",
        body: "Modern SaaS tools for productivity and automation can quickly become expensive, especially for solo developers or small teams trying to orchestrate complex AI workflows. The challenge was to build a robust, scalable system to automate content generation and data processing without relying on paid tiers of services like Zapier or AWS."
      },
      {
        section: "The Architecture",
        body: "I architected a serverless, decoupled system using three primary components:\n\n1. **Google Colab (Compute):** Acted as our heavy-lifting engine for running AI models and complex Python scripts for free. We exposed it via ngrok for webhook triggers.\n2. **Supabase (Database/Auth):** Provided a generous free tier for PostgreSQL and real-time subscriptions, acting as the central nervous system connecting the frontend to the backend.\n3. **Chrome Extensions (Client):** Custom lightweight extensions served as the UI to trigger workflows directly from the browser, injecting data into Supabase."
      },
      {
        section: "The Execution",
        body: "By listening to Postgres changes in Supabase, the Colab notebooks could immediately pick up new tasks queued from the Chrome Extension. Once a video or text generation task finished, Colab updated the row, and Supabase's real-time channels instantly notified the frontend."
      },
      {
        section: "The Impact",
        body: "This entirely free stack successfully processed over 5,000 automated tasks in its first month, scaling digital content production by 90% and saving an estimated $300/month in SaaS subscriptions."
      }
    ]
  }
];
