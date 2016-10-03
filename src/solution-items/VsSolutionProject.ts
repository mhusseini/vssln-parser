import {VsSolutionSection} from "./VsSolutionSection";
import {VsSolutionSectionCollection} from "./VsSolutionSectionCollection";

export interface VsSolutionProject extends VsSolutionSection, VsSolutionSectionCollection{
    name: string;
    type: string;
    projectGuid: string;
    typeGuid: string;
    path: string;
    projectDependencies?: VsSolutionSection;
}