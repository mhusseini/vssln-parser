import {VsSolutionSectionCollection} from "./VsSolutionSectionCollection";
import {VsSolutionProject} from "./VsSolutionProject";
import {VsSolutionSection} from "./VsSolutionSection";
export interface VsSolutionFile extends VsSolutionSection, VsSolutionSectionCollection {
    visualStudioVersion?: string;
    minimumVisualStudioVersion?: string;
    projects: VsSolutionProject[];
    solutionConfigurationPlatforms?: VsSolutionSection;
    projectConfigurationPlatforms?: VsSolutionSection;
    solutionProperties?: VsSolutionSection;
    nestedProjects?: VsSolutionSection;
    teamFoundationVersionControl?: VsSolutionSection;
}