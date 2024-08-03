export class CreateRuleDto {
    code: string;
    name: string;
    type: string;
    description: string;
  }
  
  export class UpdateRuleDto {
    code?: string;
    name?: string;
    type?: string;
    description?: string;
  }