'use client';
// Maakt alles waar geen 3D-object staat weer doorzichtig, ook na de nabewerking (scherptediepte).
// Zo blijft de grote HTML-typografie achter de werkbank zichtbaar.
import { BlendFunction, Effect, EffectAttribute } from 'postprocessing';

const fragment = /* glsl */ `
void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  float a = depth >= 0.99999 ? 0.0 : 1.0;
  outputColor = vec4(inputColor.rgb * a, a);
}
`;

export class DepthAlphaEffect extends Effect {
  constructor() {
    super('DepthAlphaEffect', fragment, { attributes: EffectAttribute.DEPTH, blendFunction: BlendFunction.SET });
  }
}
