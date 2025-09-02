import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Palette, Linkedin } from "lucide-react";
import ignacioImage from "@/assets/ignacio.jpg";
import manuelImage from "@/assets/manuel.webp";

const Team = () => {
  const teamMembers = [
    {
      name: "Ignacio Quantin",
      role: "NoCode Specialist",
      description: "Experto en desarrollo no-code y automatización. Especializado en crear soluciones tecnológicas escalables que impulsan el crecimiento de PYMEs y Startups.",
      image: ignacioImage,
      skills: ["No-Code Development", "Automatización", "Integraciones", "MVP Development"],
      linkedIn: "https://www.linkedin.com/in/ignacio-quantin/"
    },
    {
      name: "Manuel Ríos Velar",
      role: "Diseñador Gráfico",
      description: "Diseñador integral enfocado en branding y experiencia de usuario. Crea identidades visuales que comunican valor y conectan marcas con sus audiencias.",
      image: manuelImage,
      skills: ["Branding", "UI/UX Design", "Identidad Visual", "Design Systems"],
      linkedIn: "https://www.linkedin.com/in/manuel-rios-velar-34796b196/"
    }
  ];

  return (
    <section id="equipo" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Quiénes <span className="text-gradient-purple">somos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            El equipo que hace posible que PYMEs y Startups compitan con tecnología de vanguardia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <Card 
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale bg-card group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-8 text-center">
                {/* Profile photo */}
                <div className="mx-auto mb-6 w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {member.name}
                </h3>
                
                <div className="text-primary font-semibold mb-4">
                  {member.role}
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {member.description}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <div className="flex flex-wrap justify-center gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-10 h-10 p-0 rounded-full border-primary/20 hover:bg-primary/10"
                    asChild
                  >
                    <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Company mission statement */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="bg-muted/50 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              Nuestra misión
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              "Democratizar el acceso a tecnología de calidad para que cualquier empresa, 
              sin importar su tamaño, pueda competir y crecer en el mundo digital."
            </p>
            <div className="flex items-center justify-center mt-6 space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;