import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Palette, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import ignacioImage from "@/assets/ignacio.jpg";
import manuelImage from "@/assets/manuel.webp";

const Team = () => {
  const { t } = useTranslation();
  
  const teamMembers = [{
    name: t('team.members.ignacio.name'),
    role: t('team.members.ignacio.role'),
    description: t('team.members.ignacio.description'),
    image: ignacioImage,
    skills: t('team.members.ignacio.skills', { returnObjects: true }) as string[],
    linkedIn: "https://www.linkedin.com/in/ignacio-quantin/"
  }, {
    name: t('team.members.manuel.name'),
    role: t('team.members.manuel.role'),
    description: t('team.members.manuel.description'),
    image: manuelImage,
    skills: t('team.members.manuel.skills', { returnObjects: true }) as string[],
    linkedIn: "https://www.linkedin.com/in/manuel-rios-velar-34796b196/"
  }];
  return <section id="equipo" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('team.title')} <span className="text-gradient-purple">{t('team.titleHighlight')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale hover-lift bg-card group animate-fade-in-up" style={{
          animationDelay: `${index * 0.2}s`
        }}>
              <CardContent className="p-8 text-center">
                {/* Profile photo */}
                <div className="mx-auto mb-6 w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                  <img src={member.image} alt={`${member.name} - ${member.role}`} className="w-full h-full object-cover" loading="lazy" />
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
                    {member.skills.map((skill, skillIndex) => <span key={skillIndex} className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                        {skill}
                      </span>)}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center">
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0 rounded-full border-primary/20 hover:bg-primary/10" asChild>
                    <a href={member.linkedIn} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Company mission statement */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="bg-muted/50 rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              {t('team.mission.title')}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              "{t('team.mission.description')}"
            </p>
            
          </div>
        </div>
      </div>
    </section>;
};
export default Team;