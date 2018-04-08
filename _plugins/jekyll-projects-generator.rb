# module Jekyll

#   class ProjectsGenerator < Generator

#     safe true

#     def generate(site)
#       # Build an overview page
#       site.pages << GroupOverviewPageProjects.new(site, site.source, "/projects", 'projects-overview', site.data['projects'])

#       # Build a view page for each item
#       site.data['projects'].each do |project|
#         build_subpage(site, 'project', project)
#       end
#     end

#     def build_subpage(site, type, project)
#       path = "/projects/#{project[0]}"
#       newpage = GroupSubPageProject.new(site, site.source, path, type, project[1])
#       site.pages << newpage
#     end
#   end

#   # Containing all the projects to go to
#   class GroupOverviewPageProjects < Page
#     def initialize(site, base, dir, type, val)
#       @site = site
#       @base = base
#       @dir = dir
#       @name = 'index.html'

#       self.process(@name)
#       self.read_yaml(File.join(base, '_layouts'), "projects.html")
#       self.data["grouptype"] = type
#       self.data[type] = val
#     end
#   end

#   class GroupSubPageProject < Page
#     def initialize(site, base, dir, type, val)
#       @site = site
#       @base = base
#       @dir = dir
#       @name = 'index.html'

#       self.process(@name)
#       self.read_yaml(File.join(base, '_layouts'), "project.html")
#       self.data["grouptype"] = type
#       self.data[type] = val
#     end
#   end
# end
