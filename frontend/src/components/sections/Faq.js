import { useRef } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"




export default function GlassmorphicFAQSection({color}) {

  const cardRef = useRef(null)

  const faqItems = [
    {
      question: "How do I search for schools on the platform?",
      answer: "You can use the search bar on the homepage to look for schools by name, location, or program. You can also use filters to narrow down your search based on criteria like tuition fees, admission requirements, or specific courses."
    },
    {
      question: "What information do I need to apply to a school?",
      answer: "Typically, you'll need your personal details, academic history, standardized test scores (if applicable), and sometimes essays or letters of recommendation. Each school may have specific requirements, so be sure to check the application guidelines for your chosen institutions."
    },
    {
      question: "Can I save schools I'm interested in for later?",
      answer: "Yes, you can create a free account on our platform to save schools to your favorites list. This allows you to easily compare and track the schools you're most interested in applying to."
    },
    {
      question: "How do I know if I'm eligible for a particular school?",
      answer: "Each school profile on our platform includes information about admission requirements. You can check these against your qualifications. Some schools also offer eligibility checkers or pre-assessment tools to help you determine if you meet their criteria."
    },
    {
      question: "Is there a fee for using this platform?",
      answer: "Our basic search and information services are free. However, some schools may charge application fees when you decide to apply. These fees are set by the schools, not our platform."
    }
  ]





  return (
    <section className='min-h-screen w-full bg-background relative  p-4'>
      

    <div className="min-h-screen flex items-center justify-center bg-transparent p-4">
    
      <div ref={cardRef} className="w-full p-14 backdrop-blur-md bg-background/60  ">
        <CardHeader>
          <CardTitle className="text-2xl line-height-2 md:text-[50px] text-center text-foreground my-6">FREQUENTLY ASKED QUESTIONS</CardTitle>
          <CardDescription className="text-center text-foreground text-2xl font-serif ">Find answers to common questions about our school search and application platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="my-4 ">
                <AccordionTrigger 
                
                  className="text-foreground hover:text-foreground "
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent 
                  id={`content-item-${index}`}
                  className="text-foreground"
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </div>
    
    </div>
    
    </section>
  )
}