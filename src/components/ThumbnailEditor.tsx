import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fabric } from 'fabric';
import { X, Type, Download, Trash2, Palette, Upload, Undo2, Redo2, Save, FolderOpen, Check, Image as ImageIcon, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown, RotateCw, Plus, Minus, Layers, AlignLeft, AlignCenter, AlignRight, Cloud, CloudOff, Loader2, Sparkles } from 'lucide-react';

import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import * as designService from '../lib/designs';
import { saveThumbnailToHistory } from '../lib/history';
import ErrorState from './ErrorState';

interface ThumbnailEditorProps {
  imageUrl: string;
  onClose: () => void;
  suggestedTexts?: string[];
}

interface SavedDesign {
  id: string;
  name: string;
  timestamp: number;
  preview: string;
  state: string;
}

export default function ThumbnailEditor({ imageUrl, onClose, suggestedTexts = [] }: ThumbnailEditorProps) {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageObjectInputRef = useRef<HTMLInputElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const canvasInstance = useRef<fabric.Canvas | null>(null);
  const [selectedColor, setSelectedColor] = useState('#ccff00');
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'bg' | 'suggested'>('text');
  const [selectedFontSize, setSelectedFontSize] = useState<number>(60);
  const [bgScale, setBgScale] = useState(1);
  const [bgPosX, setBgPosX] = useState(400);
  const [bgPosY, setBgPosY] = useState(225);
  const [bgRepeat, setBgRepeat] = useState<'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'>('no-repeat');
  const [selectedTextAlign, setSelectedTextAlign] = useState<string>('center');
  const [selectedStrokeColor, setSelectedStrokeColor] = useState('#000000');
  const [selectedStrokeWidth, setSelectedStrokeWidth] = useState<number>(4);
  const [selectedShadowColor, setSelectedShadowColor] = useState('#000000');
  const [selectedShadowBlur, setSelectedShadowBlur] = useState<number>(0);
  const [selectedShadowOffsetX, setSelectedShadowOffsetX] = useState<number>(0);
  const [selectedShadowOffsetY, setSelectedShadowOffsetY] = useState<number>(0);
  const [isGradientEnabled, setIsGradientEnabled] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#ccff00');
  const [gradientColor2, setGradientColor2] = useState('#00e5ff');
  const [isBgGradientEnabled, setIsBgGradientEnabled] = useState(false);
  const [bgGradientColor1, setBgGradientColor1] = useState('#1e1e1e');
  const [bgGradientColor2, setBgGradientColor2] = useState('#000000');
  const [bgGradientDirection, setBgGradientDirection] = useState<'horizontal' | 'vertical' | 'diagonal'>('horizontal');
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [saveToLocalOnly, setSaveToLocalOnly] = useState(false);

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isHistoryProcessing = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const [savedDesigns, setSavedDesigns] = useState<designService.SavedDesign[]>([]);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [designName, setDesignName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>(null);
  const [error, setError] = useState<{ title: string; message: string; retry: () => void } | null>(null);

  useEffect(() => {
    const loadDesigns = async () => {
      const designs = await designService.getDesigns(user?.uid);
      setSavedDesigns(designs);
    };
    loadDesigns();
  }, [user]);

  const updateHistoryState = () => {
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
  };

  const saveHistory = () => {
    const currentCanvas = canvasInstance.current;
    if (!currentCanvas || isHistoryProcessing.current) return;
    const json = JSON.stringify(currentCanvas.toJSON(['selectable', 'evented']));
    
    if (historyIndexRef.current > -1 && historyRef.current[historyIndexRef.current] === json) return;

    const newHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    newHistory.push(json);
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      historyIndexRef.current += 1;
    }
    historyRef.current = newHistory;
    updateHistoryState();
  };

  const undo = () => {
    const currentCanvas = canvasInstance.current;
    if (isHistoryProcessing.current) return;
    if (historyIndexRef.current > 0 && currentCanvas) {
      isHistoryProcessing.current = true;
      historyIndexRef.current -= 1;
      currentCanvas.loadFromJSON(historyRef.current[historyIndexRef.current], () => {
        currentCanvas.renderAll();
        isHistoryProcessing.current = false;
        updateHistoryState();
        currentCanvas.discardActiveObject();
        // selection:cleared will handle state reset
      });
    }
  };

  const redo = () => {
    const currentCanvas = canvasInstance.current;
    if (isHistoryProcessing.current) return;
    if (historyIndexRef.current < historyRef.current.length - 1 && currentCanvas) {
      isHistoryProcessing.current = true;
      historyIndexRef.current += 1;
      currentCanvas.loadFromJSON(historyRef.current[historyIndexRef.current], () => {
        currentCanvas.renderAll();
        isHistoryProcessing.current = false;
        updateHistoryState();
        currentCanvas.discardActiveObject();
        // selection:cleared will handle state reset
      });
    }
  };

  const saveDesign = async () => {
    if (!canvasInstance.current) return;
    
    if (!currentDesignId && !designName) {
      setShowSaveModal(true);
      setDesignName('AI Money Thumbnail');
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      canvasInstance.current.discardActiveObject();
      canvasInstance.current.renderAll();
      
      const state = JSON.stringify(canvasInstance.current.toJSON(['selectable', 'evented']));
      const preview = canvasInstance.current.toDataURL({ format: 'jpeg', quality: 0.5, multiplier: 0.5 });
      
      const name = designName || savedDesigns.find(d => d.id === currentDesignId)?.name || 'Untitled';

      // Save to history as well
      try {
        await saveThumbnailToHistory(name, preview, user?.uid);
      } catch (hError) {
        console.warn("Failed to save to history, but continuing with design save:", hError);
      }
      
      let saved;
      if (saveToLocalOnly || (!user && !currentDesignId)) {
        saved = await designService.saveToLocal({
          name,
          state,
          preview
        }, currentDesignId || undefined);
      } else {
        saved = await designService.saveDesign({
          name,
          state,
          preview
        }, user?.uid, currentDesignId || undefined);
      }
      
      setCurrentDesignId(saved.id);
      setShowSaveModal(false);
      
      // Refresh list
      const designs = await designService.getDesigns(user?.uid);
      setSavedDesigns(designs);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error: any) {
      console.error("Failed to save design:", error);
      setError({
        title: "Save Failed",
        message: error.message || "We couldn't save your design. This might be due to a storage limit or connection issue.",
        retry: () => saveDesign()
      });
    } finally {
      setIsSaving(false);
    }
  };

  const createNewDesign = () => {
    if (!canvasInstance.current) return;
    if (confirm("Are you sure you want to start a new design? All unsaved changes will be lost.")) {
      canvasInstance.current.clear();
      canvasInstance.current.setBackgroundColor('#1e1e1e', () => {
        canvasInstance.current?.renderAll();
        setCurrentDesignId(null);
        setDesignName('');
        saveHistory();
      });
    }
  };

  const loadDesign = (design: designService.SavedDesign) => {
    if (!canvasInstance.current) return;
    canvasInstance.current.loadFromJSON(JSON.parse(design.state), () => {
      canvasInstance.current?.renderAll();
      setCurrentDesignId(design.id);
      saveHistory();
      setShowLoadModal(false);
    });
  };

  const deleteSavedDesign = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this design?")) return;
    
    try {
      await designService.deleteDesign(id, user?.uid);
      const designs = await designService.getDesigns(user?.uid);
      setSavedDesigns(designs);
      if (currentDesignId === id) setCurrentDesignId(null);
    } catch (error) {
      console.error("Failed to delete design:", error);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 450,
      backgroundColor: '#1e1e1e',
      preserveObjectStacking: true, // Keeps selected object on top
    });
    canvasInstance.current = initCanvas;

    // Set global defaults for better object manipulation
    fabric.Object.prototype.set({
      transparentCorners: false,
      cornerColor: '#ccff00',
      cornerStrokeColor: '#000000',
      cornerSize: 10,
      cornerStyle: 'circle',
      borderColor: '#ccff00',
      borderScaleFactor: 1.5,
      padding: 8,
      lockScalingFlip: true, // Prevent flipping when scaling
      hasRotatingPoint: true,
      rotatingPointOffset: 40,
    });

    initCanvas.on('object:modified', (e) => {
      const obj = e.target;
      if (obj && obj.type === 'i-text') {
        const textObj = obj as fabric.IText;
        const scaleX = textObj.scaleX || 1;
        
        // Sync scale to font size for cleaner state
        const newFontSize = Math.round((textObj.fontSize || 60) * scaleX);
        textObj.set({
          fontSize: newFontSize,
          scaleX: 1,
          scaleY: 1
        });
        setSelectedFontSize(newFontSize);
      }
      saveHistory();
    });

    initCanvas.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      setSelectedObjectType(obj?.type || null);
      if (obj && obj.type === 'i-text') {
        const textObj = obj as fabric.IText;
        setSelectedFontSize(textObj.fontSize || 60);
        setSelectedTextAlign(textObj.textAlign || 'center');
        setSelectedStrokeColor((textObj.stroke as string) || '#000000');
        setSelectedStrokeWidth(textObj.strokeWidth || 0);
        
        if (textObj.shadow instanceof fabric.Shadow) {
          setSelectedShadowColor(textObj.shadow.color || '#000000');
          setSelectedShadowBlur(textObj.shadow.blur || 0);
          setSelectedShadowOffsetX(textObj.shadow.offsetX || 0);
          setSelectedShadowOffsetY(textObj.shadow.offsetY || 0);
        } else {
          setSelectedShadowBlur(0);
          setSelectedShadowOffsetX(0);
          setSelectedShadowOffsetY(0);
        }

        if (textObj.fill instanceof fabric.Gradient) {
          setIsGradientEnabled(true);
          setGradientColor1(textObj.fill.colorStops?.[0]?.color || '#ffffff');
          setGradientColor2(textObj.fill.colorStops?.[1]?.color || '#000000');
        } else {
          setIsGradientEnabled(false);
        }
      }
    });
    initCanvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0];
      setSelectedObjectType(obj?.type || null);
      if (obj && obj.type === 'i-text') {
        const textObj = obj as fabric.IText;
        setSelectedFontSize(textObj.fontSize || 60);
        setSelectedTextAlign(textObj.textAlign || 'center');
        setSelectedStrokeColor((textObj.stroke as string) || '#000000');
        setSelectedStrokeWidth(textObj.strokeWidth || 0);

        if (textObj.shadow instanceof fabric.Shadow) {
          setSelectedShadowColor(textObj.shadow.color || '#000000');
          setSelectedShadowBlur(textObj.shadow.blur || 0);
          setSelectedShadowOffsetX(textObj.shadow.offsetX || 0);
          setSelectedShadowOffsetY(textObj.shadow.offsetY || 0);
        } else {
          setSelectedShadowBlur(0);
          setSelectedShadowOffsetX(0);
          setSelectedShadowOffsetY(0);
        }

        if (textObj.fill instanceof fabric.Gradient) {
          setIsGradientEnabled(true);
          setGradientColor1(textObj.fill.colorStops?.[0]?.color || '#ffffff');
          setGradientColor2(textObj.fill.colorStops?.[1]?.color || '#000000');
        } else {
          setIsGradientEnabled(false);
        }
      }
    });
    initCanvas.on('selection:cleared', () => {
      setSelectedObjectType(null);
      setSelectedFontSize(60);
      setSelectedTextAlign('center');
    });

    initCanvas.on('object:added', saveHistory);
    initCanvas.on('object:removed', saveHistory);
    initCanvas.on('text:editing:exited', saveHistory);

    const loadBgImage = (url: string) => {
      fabric.Image.fromURL(url, (img) => {
        if (!canvasInstance.current) return;
        const scale = Math.max(800 / (img.width || 800), 450 / (img.height || 450));
        setBgScale(scale);
        img.set({
          originX: 'center',
          originY: 'center',
          left: 400,
          top: 225,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        });
        canvasInstance.current.setBackgroundImage(img, () => {
          if (!canvasInstance.current) return;
          canvasInstance.current.renderAll();
          saveHistory();
        });
      }, { crossOrigin: 'anonymous' });
    };

    loadBgImage(imageUrl);
    setCanvas(initCanvas);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvasInstance.current) return;
      const activeObject = canvasInstance.current.getActiveObject();
      const isEditingText = activeObject && activeObject.type === 'i-text' && (activeObject as fabric.IText).isEditing;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (activeObject && activeObject.type === 'i-text') {
           if (isEditingText) return;
           canvasInstance.current.remove(activeObject);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (isEditingText) return;
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (isEditingText) return;
        redo();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvasInstance.current = null;
      initCanvas.dispose();
    };
  }, [imageUrl]);

  const addText = (initialText: string = 'DOUBLE CLICK TO EDIT') => {
    if (!canvas) return;
    const text = new fabric.IText(initialText, {
      left: 400,
      top: 225,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Impact, sans-serif',
      fill: '#ccff00',
      stroke: '#000000',
      strokeWidth: 6,
      fontSize: 80,
      fontWeight: 'bold',
      paintFirst: 'stroke',
      textAlign: 'center',
      shadow: new fabric.Shadow({
        color: '#000000',
        blur: 8,
        offsetX: 4,
        offsetY: 4
      }),
      // Enable all scaling handles
      lockScalingX: false,
      lockScalingY: false,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveHistory();
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  };

  const updateBgProperty = (property: string, value: any) => {
    if (!canvas) return;
    const bgImage = canvas.backgroundImage as fabric.Image;
    if (!bgImage) return;

    switch (property) {
      case 'scale':
        setBgScale(value);
        bgImage.set({ scaleX: value, scaleY: value });
        break;
      case 'posX':
        setBgPosX(value);
        bgImage.set({ left: value });
        break;
      case 'posY':
        setBgPosY(value);
        bgImage.set({ top: value });
        break;
      case 'repeat':
        setBgRepeat(value);
        (canvas as any).backgroundImageRepeat = value;
        break;
    }
    canvas.renderAll();
    saveHistory();
  };

  const changeColor = (color: string) => {
    if (!canvas) return;
    if (activeTab === 'text') {
      setSelectedColor(color);
      setIsGradientEnabled(false); // Disable gradient when solid color is picked
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        activeObject.set('fill', color);
        canvas.renderAll();
        saveHistory();
      }
    } else {
      // Change Background Color
      setIsBgGradientEnabled(false);
      setBgGradientColor1(color);
      canvas.setBackgroundImage(null, () => {
        canvas.setBackgroundColor(color, () => {
          canvas.renderAll();
          saveHistory();
        });
      });
    }
  };

  const changeFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      (activeObject as fabric.IText).set('fontFamily', e.target.value);
      canvas.renderAll();
      saveHistory();
    }
  };

  const changeFontSize = (delta: number) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      const currentSize = (activeObject as fabric.IText).fontSize || 60;
      const newSize = Math.max(10, currentSize + delta);
      (activeObject as fabric.IText).set('fontSize', newSize);
      setSelectedFontSize(newSize);
      canvas.renderAll();
      saveHistory();
    }
  };

  const handleFontSizeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    if (!isNaN(newSize) && canvasInstance.current) {
      const activeObject = canvasInstance.current.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        (activeObject as fabric.IText).set('fontSize', newSize);
        canvasInstance.current.renderAll();
        setSelectedFontSize(newSize);
        saveHistory();
      }
    }
  };

  const changeTextAlign = (align: string) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      (activeObject as fabric.IText).set('textAlign', align);
      setSelectedTextAlign(align);
      canvas.renderAll();
      saveHistory();
    }
  };

  const updateTextProperty = (property: string, value: any) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject() as fabric.IText;
    if (!activeObject || activeObject.type !== 'i-text') return;

    switch (property) {
      case 'stroke':
        setSelectedStrokeColor(value);
        activeObject.set('stroke', value);
        break;
      case 'strokeWidth':
        setSelectedStrokeWidth(value);
        activeObject.set('strokeWidth', value);
        break;
      case 'shadowColor':
        setSelectedShadowColor(value);
        applyShadow(activeObject, { color: value });
        break;
      case 'shadowBlur':
        setSelectedShadowBlur(value);
        applyShadow(activeObject, { blur: value });
        break;
      case 'shadowOffsetX':
        setSelectedShadowOffsetX(value);
        applyShadow(activeObject, { offsetX: value });
        break;
      case 'shadowOffsetY':
        setSelectedShadowOffsetY(value);
        applyShadow(activeObject, { offsetY: value });
        break;
      case 'gradient':
        setIsGradientEnabled(value.enabled);
        if (value.enabled) {
          applyGradient(activeObject, value.c1 || gradientColor1, value.c2 || gradientColor2);
        } else {
          activeObject.set('fill', selectedColor);
        }
        break;
    }
    canvas.renderAll();
    saveHistory();
  };

  const applyShadow = (obj: fabric.Object, options: any) => {
    const currentShadow = obj.shadow as fabric.Shadow;
    const shadow = new fabric.Shadow({
      color: options.color || (currentShadow ? currentShadow.color : selectedShadowColor),
      blur: options.blur !== undefined ? options.blur : (currentShadow ? currentShadow.blur : selectedShadowBlur),
      offsetX: options.offsetX !== undefined ? options.offsetX : (currentShadow ? currentShadow.offsetX : selectedShadowOffsetX),
      offsetY: options.offsetY !== undefined ? options.offsetY : (currentShadow ? currentShadow.offsetY : selectedShadowOffsetY),
    });
    obj.set('shadow', shadow);
  };

  const applyGradient = (obj: fabric.Object, c1: string, c2: string) => {
    const gradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords: { x1: 0, y1: 0, x2: obj.width || 100, y2: 0 },
      colorStops: [
        { offset: 0, color: c1 },
        { offset: 1, color: c2 }
      ]
    });
    obj.set('fill', gradient);
    setGradientColor1(c1);
    setGradientColor2(c2);
  };

  const applyViralStyle = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject() as fabric.IText;
    if (!activeObject || activeObject.type !== 'i-text') return;

    const viralFill = '#ccff00';
    const viralStroke = '#000000';
    const viralStrokeWidth = 8;
    const viralShadowColor = '#000000';
    const viralShadowBlur = 10;
    const viralShadowOffsetX = 5;
    const viralShadowOffsetY = 5;

    activeObject.set({
      fill: viralFill,
      stroke: viralStroke,
      strokeWidth: viralStrokeWidth,
      paintFirst: 'stroke',
      shadow: new fabric.Shadow({
        color: viralShadowColor,
        blur: viralShadowBlur,
        offsetX: viralShadowOffsetX,
        offsetY: viralShadowOffsetY,
      })
    });

    // Update state to match
    setSelectedColor(viralFill);
    setSelectedStrokeColor(viralStroke);
    setSelectedStrokeWidth(viralStrokeWidth);
    setSelectedShadowColor(viralShadowColor);
    setSelectedShadowBlur(viralShadowBlur);
    setSelectedShadowOffsetX(viralShadowOffsetX);
    setSelectedShadowOffsetY(viralShadowOffsetY);
    setIsGradientEnabled(false);

    canvas.renderAll();
    saveHistory();
  };

  const applyDropShadow = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject() as fabric.IText;
    if (!activeObject || activeObject.type !== 'i-text') return;

    const shadowColor = '#000000';
    const shadowBlur = 10;
    const shadowOffsetX = 5;
    const shadowOffsetY = 5;

    activeObject.set({
      shadow: new fabric.Shadow({
        color: shadowColor,
        blur: shadowBlur,
        offsetX: shadowOffsetX,
        offsetY: shadowOffsetY,
      })
    });

    // Update state to match
    setSelectedShadowColor(shadowColor);
    setSelectedShadowBlur(shadowBlur);
    setSelectedShadowOffsetX(shadowOffsetX);
    setSelectedShadowOffsetY(shadowOffsetY);
    
    canvas.renderAll();
    saveHistory();
  };

  const applyBgGradient = (c1: string, c2: string, dir: string) => {
    if (!canvas) return;
    let coords = { x1: 0, y1: 0, x2: 800, y2: 0 }; // horizontal
    if (dir === 'vertical') {
      coords = { x1: 0, y1: 0, x2: 0, y2: 450 };
    } else if (dir === 'diagonal') {
      coords = { x1: 0, y1: 0, x2: 800, y2: 450 };
    }

    const gradient = new fabric.Gradient({
      type: 'linear',
      gradientUnits: 'pixels',
      coords: coords,
      colorStops: [
        { offset: 0, color: c1 },
        { offset: 1, color: c2 }
      ]
    });

    canvas.setBackgroundImage(null, () => {
      canvas.setBackgroundColor(gradient as any, () => {
        canvas.renderAll();
        saveHistory();
      });
    });
  };

  const rotateObject = (angle: number) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const currentAngle = activeObject.angle || 0;
      activeObject.set('angle', currentAngle + angle);
      canvas.renderAll();
      saveHistory();
    }
  };

  const scaleObject = (factor: number) => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const currentScaleX = activeObject.scaleX || 1;
      const currentScaleY = activeObject.scaleY || 1;
      activeObject.set({
        scaleX: currentScaleX * factor,
        scaleY: currentScaleY * factor
      });
      canvas.renderAll();
      saveHistory();
    }
  };

  const layerControl = (action: 'front' | 'back' | 'forward' | 'backward') => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      switch (action) {
        case 'front': activeObject.bringToFront(); break;
        case 'back': activeObject.sendToBack(); break;
        case 'forward': activeObject.bringForward(); break;
        case 'backward': (activeObject as any).sendBackwards(); break;
      }
      canvas.renderAll();
      saveHistory();
    }
  };

  const applyStylePreset = (preset: 'viral' | 'gamer' | 'minimal' | 'bold' | 'neon') => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject() as fabric.IText;
    if (!activeObject || activeObject.type !== 'i-text') return;

    let fill = '#ffffff';
    let stroke = '#000000';
    let strokeWidth = 0;
    let shadow = { color: '#000000', blur: 0, offsetX: 0, offsetY: 0 };

    switch (preset) {
      case 'viral':
        fill = '#ccff00';
        stroke = '#000000';
        strokeWidth = 6;
        shadow = { color: '#000000', blur: 8, offsetX: 4, offsetY: 4 };
        break;
      case 'gamer':
        fill = '#00e5ff';
        stroke = '#000000';
        strokeWidth = 8;
        shadow = { color: '#00e5ff', blur: 15, offsetX: 0, offsetY: 0 };
        break;
      case 'minimal':
        fill = '#ffffff';
        stroke = '#000000';
        strokeWidth = 0;
        shadow = { color: 'rgba(0,0,0,0.5)', blur: 10, offsetX: 0, offsetY: 5 };
        break;
      case 'bold':
        fill = '#ff3d00';
        stroke = '#ffffff';
        strokeWidth = 3;
        shadow = { color: '#000000', blur: 10, offsetX: 5, offsetY: 5 };
        break;
      case 'neon':
        fill = '#ffffff';
        stroke = '#ff00de';
        strokeWidth = 2;
        shadow = { color: '#ff00de', blur: 25, offsetX: 0, offsetY: 0 };
        break;
    }

    activeObject.set({
      fill,
      stroke,
      strokeWidth,
      shadow: new fabric.Shadow(shadow)
    });

    setSelectedColor(fill);
    setSelectedStrokeColor(stroke);
    setSelectedStrokeWidth(strokeWidth);
    setSelectedShadowColor(shadow.color);
    setSelectedShadowBlur(shadow.blur);
    setSelectedShadowOffsetX(shadow.offsetX);
    setSelectedShadowOffsetY(shadow.offsetY);
    setIsGradientEnabled(false);

    canvas.renderAll();
    saveHistory();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !canvas) return;
    
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result as string;
      fabric.Image.fromURL(data, (img) => {
        const scale = Math.max(800 / (img.width || 800), 450 / (img.height || 450));
        img.set({
          originX: 'center',
          originY: 'center',
          left: 400,
          top: 225,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        });
        canvas.setBackgroundImage(img, () => {
          canvas.renderAll();
          saveHistory();
        });
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddImageObject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
    
    if (imageObjectInputRef.current) {
      imageObjectInputRef.current.value = '';
    }
  };

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/') || !canvasInstance.current) return;
    
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result as string;
      fabric.Image.fromURL(data, (img) => {
        const maxDim = 300;
        let scale = 1;
        if (img.width && img.height) {
          if (img.width > maxDim || img.height > maxDim) {
            scale = Math.min(maxDim / img.width, maxDim / img.height);
          }
        }
        const offset = (canvasInstance.current?.getObjects().length || 0) * 10;
        img.set({
          left: 400 + (offset % 100),
          top: 225 + (offset % 100),
          originX: 'center',
          originY: 'center',
          scaleX: scale,
          scaleY: scale,
        });
        canvasInstance.current?.add(img);
        canvasInstance.current?.setActiveObject(img);
        canvasInstance.current?.renderAll();
        saveHistory();
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        handleImageFile(file);
      });
    }
  };

  const downloadImage = () => {
    if (!canvas) return;
    // Deselect before download so controls don't show
    canvas.discardActiveObject();
    canvas.renderAll();
    
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1280 / 800 // Scale up to 1280x720 (standard 720p thumbnail)
    });
    const link = document.createElement('a');
    link.download = 'thumbmagic-export.png';
    link.href = dataURL;
    link.click();
  };

  const colors = ['#ffffff', '#ccff00', '#00e5ff', '#ff90e8', '#ff5722', '#000000', '#1e1e1e'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/50 border border-slate-800 shadow-2xl w-full max-w-7xl rounded-[3rem] overflow-hidden flex flex-col h-[90vh] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800 bg-slate-900/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20">
              <ImageIcon className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black uppercase tracking-tight text-white leading-none mb-1">Thumbnail Studio</h2>
              <p className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-ink/20">Professional Editor</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-8 py-4 border-b border-slate-800 bg-slate-900/20">
          <AnimatePresence>
            {error && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <ErrorState 
                  title={error.title}
                  message={error.message}
                  onRetry={error.retry}
                  onClose={() => setError(null)}
                  className="max-w-md w-full"
                />
              </div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-1 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800">
            <button 
              onClick={undo} 
              disabled={!canUndo}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                canUndo ? "hover:bg-slate-800 text-white" : "text-slate-700 cursor-not-allowed"
              )}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <button 
              onClick={redo} 
              disabled={!canRedo}
              className={cn(
                "p-2.5 rounded-xl transition-all",
                canRedo ? "hover:bg-slate-800 text-white" : "text-slate-700 cursor-not-allowed"
              )}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => addText()} 
            className="flex items-center gap-3 px-6 py-3.5 bg-primary text-black rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10 active:scale-95"
          >
            <Type className="w-4 h-4" /> Add Text
          </button>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-950/50 border border-slate-800 rounded-2xl">
            <select 
              onChange={changeFontFamily} 
              className="bg-transparent font-display font-black uppercase text-[10px] tracking-widest outline-none cursor-pointer text-slate-200 appearance-none pr-4"
              title="Font Family"
            >
              <option value="Impact, sans-serif">Impact</option>
              <option value="'Bebas Neue', sans-serif">Bebas Neue</option>
              <option value="'Luckiest Guy', cursive">Luckiest Guy</option>
              <option value="'Montserrat', sans-serif">Montserrat</option>
              <option value="'Oswald', sans-serif">Oswald</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Anton', sans-serif">Anton</option>
              <option value="'Righteous', cursive">Righteous</option>
              <option value="'Permanent Marker', cursive">Marker</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Courier New', Courier, monospace">Courier New</option>
              <option value="'Times New Roman', Times, serif">Times New Roman</option>
            </select>
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <button onClick={() => changeFontSize(-5)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all" title="Decrease Font Size"><Minus className="w-4 h-4" /></button>
              <input 
                type="number" 
                value={selectedFontSize} 
                onChange={handleFontSizeInputChange}
                className="w-12 bg-slate-950 border border-slate-800 rounded-lg text-center font-display font-black text-[10px] outline-none text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none py-1"
                title="Font Size"
              />
              <button onClick={() => changeFontSize(5)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all" title="Increase Font Size"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-1 border-l border-slate-800 pl-4">
              <button 
                onClick={() => changeTextAlign('left')} 
                className={cn("p-2.5 hover:bg-slate-800 rounded-xl transition-all", selectedTextAlign === 'left' ? "bg-primary text-black" : "text-slate-400")} 
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => changeTextAlign('center')} 
                className={cn("p-2.5 hover:bg-slate-800 rounded-xl transition-all", selectedTextAlign === 'center' ? "bg-primary text-black" : "text-slate-400")} 
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button 
                onClick={() => changeTextAlign('right')} 
                className={cn("p-2.5 hover:bg-slate-800 rounded-xl transition-all", selectedTextAlign === 'right' ? "bg-primary text-black" : "text-slate-400")} 
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <input type="file" ref={imageObjectInputRef} onChange={handleAddImageObject} accept="image/*" className="hidden" />
          <button onClick={() => imageObjectInputRef.current?.click()} className="flex items-center gap-3 px-6 py-3.5 bg-slate-950/50 text-white border border-slate-800 rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all active:scale-95">
            <ImageIcon className="w-4 h-4 text-secondary" /> Add Image
          </button>
          
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-6 py-3.5 bg-slate-950/50 text-white border border-slate-800 rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all active:scale-95">
            <Upload className="w-4 h-4 text-tertiary" /> Upload BG
          </button>

          {selectedObjectType && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 border border-slate-800 rounded-2xl ml-2">
              <div className="flex items-center gap-1 pr-3 border-r border-slate-800">
                <button onClick={() => layerControl('front')} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white" title="Bring to Front"><ChevronsUp className="w-4 h-4" /></button>
                <button onClick={() => layerControl('forward')} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white" title="Bring Forward"><ChevronUp className="w-4 h-4" /></button>
                <button onClick={() => layerControl('backward')} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white" title="Send Backward"><ChevronDown className="w-4 h-4" /></button>
                <button onClick={() => layerControl('back')} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white" title="Send to Back"><ChevronsDown className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-1 pl-1">
                <button onClick={() => rotateObject(45)} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white" title="Rotate 45°"><RotateCw className="w-4 h-4" /></button>
                <button onClick={() => scaleObject(1.1)} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white" title="Scale Up"><Plus className="w-4 h-4" /></button>
                <button onClick={() => scaleObject(0.9)} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white" title="Scale Down"><Minus className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          <div className="flex gap-2 p-1 bg-slate-950/50 rounded-2xl border border-slate-800">
            {[
              { id: 'text', label: 'Text', icon: Type },
              { id: 'suggested', label: 'Suggested', icon: Sparkles },
              { id: 'style', label: 'Style', icon: Palette },
              { id: 'bg', label: 'Background', icon: ImageIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-[10px] font-display font-black uppercase tracking-widest rounded-xl transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-black shadow-lg shadow-primary/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
            {activeTab === 'style' ? (
              <div className="flex items-center gap-4 py-1 px-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Presets</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={applyViralStyle}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-xl font-display font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                      <Sparkles className="w-3 h-3" /> Viral
                    </button>
                    <button 
                      onClick={applyDropShadow}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-display font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all active:scale-95"
                    >
                      <Layers className="w-3 h-3" /> Shadow
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-l border-slate-700 pl-4 border-r pr-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Outline</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={selectedStrokeColor} 
                        onChange={(e) => updateTextProperty('stroke', e.target.value)}
                        className="w-5 h-5 rounded-md cursor-pointer bg-transparent border border-slate-600"
                      />
                      <input 
                        type="range" min="0" max="20" step="1" 
                        value={selectedStrokeWidth} 
                        onChange={(e) => updateTextProperty('strokeWidth', parseInt(e.target.value))}
                        className="w-14 accent-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Shadow FX</span>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={selectedShadowColor} 
                        onChange={(e) => updateTextProperty('shadowColor', e.target.value)}
                        className="w-6 h-6 rounded-lg cursor-pointer bg-transparent border border-slate-600 hover:border-primary transition-colors"
                        title="Shadow Color"
                      />
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[7px] font-black text-slate-600 uppercase w-6">Blur</span>
                          <input 
                            type="range" min="0" max="50" step="1" 
                            value={selectedShadowBlur} 
                            onChange={(e) => updateTextProperty('shadowBlur', parseInt(e.target.value))}
                            className="w-20 accent-primary h-1.5"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[7px] font-black text-slate-600 uppercase w-6">Dist</span>
                          <div className="flex gap-1">
                            <input 
                              type="range" min="-30" max="30" step="1" 
                              value={selectedShadowOffsetX} 
                              onChange={(e) => updateTextProperty('shadowOffsetX', parseInt(e.target.value))}
                              className="w-9 accent-primary h-1.5"
                              title="Offset X"
                            />
                            <input 
                              type="range" min="-30" max="30" step="1" 
                              value={selectedShadowOffsetY} 
                              onChange={(e) => updateTextProperty('shadowOffsetY', parseInt(e.target.value))}
                              className="w-9 accent-primary h-1.5"
                              title="Offset Y"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Gradient</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateTextProperty('gradient', { enabled: !isGradientEnabled })}
                      className={cn(
                        "px-2 py-0.5 text-[9px] font-black uppercase rounded-md transition-all border",
                        isGradientEnabled ? "bg-primary border-primary text-black" : "bg-slate-800 border-slate-700 text-slate-500"
                      )}
                    >
                      {isGradientEnabled ? 'ON' : 'OFF'}
                    </button>
                    {isGradientEnabled && (
                      <div className="flex gap-1">
                        <input 
                          type="color" 
                          value={gradientColor1} 
                          onChange={(e) => updateTextProperty('gradient', { enabled: true, c1: e.target.value })}
                          className="w-4 h-4 rounded-sm cursor-pointer bg-transparent border border-slate-600"
                        />
                        <input 
                          type="color" 
                          value={gradientColor2} 
                          onChange={(e) => updateTextProperty('gradient', { enabled: true, c2: e.target.value })}
                          className="w-4 h-4 rounded-sm cursor-pointer bg-transparent border border-slate-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 py-1 items-center">
                {activeTab === 'text' && (
                  <div className="flex items-center gap-4 px-2 border-r border-slate-700 mr-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Shadow</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={selectedShadowColor} 
                          onChange={(e) => updateTextProperty('shadowColor', e.target.value)}
                          className="w-5 h-5 rounded-md cursor-pointer bg-transparent border border-slate-600"
                          title="Shadow Color"
                        />
                        <input 
                          type="range" min="0" max="40" step="1" 
                          value={selectedShadowBlur} 
                          onChange={(e) => updateTextProperty('shadowBlur', parseInt(e.target.value))}
                          className="w-16 accent-primary h-1.5"
                          title="Shadow Blur"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Offset</span>
                      <div className="flex gap-1">
                        <input 
                          type="range" min="-20" max="20" step="1" 
                          value={selectedShadowOffsetX} 
                          onChange={(e) => updateTextProperty('shadowOffsetX', parseInt(e.target.value))}
                          className="w-8 accent-primary h-1.5"
                          title="Offset X"
                        />
                        <input 
                          type="range" min="-20" max="20" step="1" 
                          value={selectedShadowOffsetY} 
                          onChange={(e) => updateTextProperty('shadowOffsetY', parseInt(e.target.value))}
                          className="w-8 accent-primary h-1.5"
                          title="Offset Y"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'suggested' && (
                  <div className="flex items-center gap-4 px-2 border-r border-slate-700 mr-2 overflow-x-auto max-w-2xl scrollbar-hide">
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <span className="text-[9px] font-black uppercase text-primary tracking-wider">AI Suggestions</span>
                      <span className="text-[7px] font-black uppercase text-slate-500 tracking-widest">Click to add</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {suggestedTexts.length > 0 ? (
                        suggestedTexts.map((text, i) => (
                          <button
                            key={i}
                            onClick={() => addText(text)}
                            className="flex-shrink-0 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-primary transition-all group active:scale-95"
                          >
                            <span className="text-[9px] font-display font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors whitespace-nowrap">{text}</span>
                          </button>
                        ))
                      ) : (
                        <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest px-4 italic">No suggestions available</span>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === 'bg' && canvas?.backgroundImage && (
                  <div className="flex items-center gap-4 px-2 border-r border-slate-700 mr-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Scale</span>
                      <input 
                        type="range" min="0.1" max="5" step="0.1" 
                        value={bgScale} 
                        onChange={(e) => updateBgProperty('scale', parseFloat(e.target.value))}
                        className="w-16 accent-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">X</span>
                      <input 
                        type="range" min="0" max="800" step="1" 
                        value={bgPosX} 
                        onChange={(e) => updateBgProperty('posX', parseInt(e.target.value))}
                        className="w-16 accent-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Y</span>
                      <input 
                        type="range" min="0" max="450" step="1" 
                        value={bgPosY} 
                        onChange={(e) => updateBgProperty('posY', parseInt(e.target.value))}
                        className="w-16 accent-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Tile</span>
                      <select 
                        value={bgRepeat} 
                        onChange={(e) => updateBgProperty('repeat', e.target.value)}
                        className="bg-transparent text-[9px] font-black uppercase outline-none text-slate-300"
                      >
                        <option value="no-repeat">None</option>
                        <option value="repeat">Both</option>
                        <option value="repeat-x">X</option>
                        <option value="repeat-y">Y</option>
                      </select>
                    </div>
                  </div>
                )}
                {activeTab === 'bg' && (
                  <div className="flex items-center gap-4 px-2 border-r border-slate-700 mr-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">Gradient BG</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            const newEnabled = !isBgGradientEnabled;
                            setIsBgGradientEnabled(newEnabled);
                            if (newEnabled) {
                              applyBgGradient(bgGradientColor1, bgGradientColor2, bgGradientDirection);
                            } else {
                              changeColor(bgGradientColor1);
                            }
                          }}
                          className={cn(
                            "px-2 py-0.5 text-[9px] font-black uppercase rounded-md transition-all border",
                            isBgGradientEnabled ? "bg-primary border-primary text-black" : "bg-slate-800 border-slate-700 text-slate-500"
                          )}
                        >
                          {isBgGradientEnabled ? 'ON' : 'OFF'}
                        </button>
                        {isBgGradientEnabled && (
                          <>
                            <input 
                              type="color" 
                              value={bgGradientColor1} 
                              onChange={(e) => {
                                setBgGradientColor1(e.target.value);
                                applyBgGradient(e.target.value, bgGradientColor2, bgGradientDirection);
                              }}
                              className="w-4 h-4 rounded-sm cursor-pointer bg-transparent border border-slate-600"
                            />
                            <input 
                              type="color" 
                              value={bgGradientColor2} 
                              onChange={(e) => {
                                setBgGradientColor2(e.target.value);
                                applyBgGradient(bgGradientColor1, e.target.value, bgGradientDirection);
                              }}
                              className="w-4 h-4 rounded-sm cursor-pointer bg-transparent border border-slate-600"
                            />
                            <select 
                              value={bgGradientDirection}
                              onChange={(e) => {
                                const dir = e.target.value as any;
                                setBgGradientDirection(dir);
                                applyBgGradient(bgGradientColor1, bgGradientColor2, dir);
                              }}
                              className="bg-transparent text-[9px] font-black uppercase outline-none border border-slate-700 rounded px-1 text-slate-300"
                            >
                              <option value="horizontal">H</option>
                              <option value="vertical">V</option>
                              <option value="diagonal">D</option>
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'text' && (
                  <div className="flex items-center gap-3 px-2 border-r border-slate-700 mr-2">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider mr-1">Presets</span>
                    <div className="flex gap-1.5">
                      <button onClick={() => applyStylePreset('viral')} className="px-2 py-1 bg-primary text-black text-[8px] font-black uppercase rounded-md hover:scale-105 transition-all">Viral</button>
                      <button onClick={() => applyStylePreset('gamer')} className="px-2 py-1 bg-secondary text-black text-[8px] font-black uppercase rounded-md hover:scale-105 transition-all">Gamer</button>
                      <button onClick={() => applyStylePreset('minimal')} className="px-2 py-1 bg-white text-black text-[8px] font-black uppercase rounded-md hover:scale-105 transition-all">Clean</button>
                      <button onClick={() => applyStylePreset('bold')} className="px-2 py-1 bg-red-500 text-white text-[8px] font-black uppercase rounded-md hover:scale-105 transition-all">Bold</button>
                      <button onClick={() => applyStylePreset('neon')} className="px-2 py-1 bg-pink-500 text-white text-[8px] font-black uppercase rounded-md hover:scale-105 transition-all">Neon</button>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  {colors.map(c => (
                    <button 
                      key={c} 
                      onClick={() => changeColor(c)}
                      className={`w-5 h-5 rounded-full border border-white/10 transition-transform hover:scale-110 ${((activeTab === 'text' && selectedColor === c) || (activeTab === 'bg' && !isBgGradientEnabled && canvas?.backgroundColor === c)) ? 'ring-2 ring-primary ring-offset-2 ring-offset-slate-900' : ''}`}
                      style={{ backgroundColor: c }}
                      title={`Set ${activeTab} color to ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}
          <button onClick={deleteSelected} className="flex items-center gap-3 px-6 py-3.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all ml-auto active:scale-95">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          
          <div className="flex items-center gap-3 border-l border-slate-800 pl-6 ml-2">
            <button 
              onClick={createNewDesign}
              className="flex items-center gap-3 px-6 py-3.5 bg-slate-950/50 text-white border border-slate-800 rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all active:scale-95"
              title="New Design"
            >
              <Plus className="w-4 h-4 text-primary" /> New
            </button>
            <button 
              onClick={saveDesign} 
              disabled={isSaving}
              className={cn(
                "flex items-center gap-3 px-6 py-3.5 bg-secondary text-black rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all shadow-xl shadow-secondary/10 active:scale-95",
                isSaving && "opacity-50 cursor-not-allowed"
              )}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />)}
              {isSaving ? 'Saving...' : (saveSuccess ? 'Saved!' : (currentDesignId ? 'Update' : 'Save'))}
            </button>
            {!user && (
              <div className="hidden lg:flex flex-col gap-0.5 border-l border-slate-800 pl-4">
                <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Guest Mode</span>
                <span className="text-[7px] font-black uppercase text-slate-600 tracking-widest">Saving to Local Storage</span>
              </div>
            )}
            <button 
              onClick={() => setShowLoadModal(true)} 
              className="flex items-center gap-3 px-6 py-3.5 bg-slate-950/50 text-white border border-slate-800 rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all active:scale-95"
            >
              <FolderOpen className="w-4 h-4" /> Load
            </button>
          </div>

          <button onClick={downloadImage} className="flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all shadow-xl shadow-white/5 ml-2 active:scale-95">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>

        <div 
          className="flex-1 bg-slate-950 flex items-center justify-center overflow-auto relative p-12 md:p-20"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={cn(
            "relative rounded-2xl overflow-hidden transition-all duration-500 shadow-[0_0_100px_rgba(0,0,0,0.5)]",
            isDragging && "ring-8 ring-primary/20 ring-offset-[20px] ring-offset-slate-950 scale-[1.02]"
          )}>
            <div className="absolute inset-0 border border-slate-800 rounded-2xl pointer-events-none z-20" />
            <canvas ref={canvasRef} />
            {isDragging && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-[4px] flex flex-col items-center justify-center pointer-events-none z-30">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-slate-900/90 border border-slate-700 p-12 rounded-[3rem] flex flex-col items-center gap-6 shadow-2xl backdrop-blur-xl"
                >
                  <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center animate-bounce shadow-2xl shadow-primary/40">
                    <Plus className="w-10 h-10 text-black" />
                  </div>
                  <span className="font-display font-black uppercase tracking-[0.2em] text-2xl text-white">Drop to Add Image</span>
                </motion.div>
              </div>
            )}
          </div>

          {showSaveModal && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900/50 border border-slate-800 shadow-2xl w-full max-w-md flex flex-col rounded-[3rem] overflow-hidden backdrop-blur-xl p-10"
              >
                <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white mb-6">Save Design</h3>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-slate-500 mb-2 block">Design Name</label>
                    <input 
                      type="text" 
                      value={designName}
                      onChange={(e) => setDesignName(e.target.value)}
                      placeholder="Enter design name..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white font-medium outline-none focus:border-primary transition-all"
                      autoFocus
                    />
                  </div>

                  {user && (
                    <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-2xl">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-display font-black uppercase tracking-wider text-white">Save to Local Storage</span>
                        <span className="text-[8px] font-medium text-slate-500 uppercase tracking-widest">Browser only, no cloud sync</span>
                      </div>
                      <button 
                        onClick={() => setSaveToLocalOnly(!saveToLocalOnly)}
                        className={cn(
                          "w-12 h-6 rounded-full transition-all relative",
                          saveToLocalOnly ? "bg-primary" : "bg-slate-800"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 rounded-full transition-all bg-white",
                          saveToLocalOnly ? "left-7" : "left-1"
                        )} />
                      </button>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-6 py-4 bg-slate-800 text-white rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveDesign}
                      disabled={isSaving || !designName.trim()}
                      className="flex-1 px-6 py-4 bg-primary text-black rounded-2xl font-display font-black uppercase text-[10px] tracking-widest hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Now'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {showLoadModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/50 border border-slate-800 shadow-2xl w-full max-w-5xl max-h-[80vh] flex flex-col rounded-[3rem] overflow-hidden backdrop-blur-xl"
              >
                <div className="flex items-center justify-between px-10 py-8 border-b border-slate-800 bg-slate-900/30">
                  <div>
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white leading-none mb-1">Saved Designs</h3>
                    <p className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-ink/20">Your Creative Library</p>
                  </div>
                  <button onClick={() => setShowLoadModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-10 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-slate-950/30">
                  {savedDesigns.length === 0 ? (
                    <div className="col-span-full text-center py-32">
                      <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-800 shadow-2xl">
                        <FolderOpen className="w-10 h-10 text-slate-700" />
                      </div>
                      <p className="text-2xl font-display font-black uppercase tracking-tight text-slate-400">No saved designs yet.</p>
                      <p className="text-slate-600 mt-2 font-medium">Your creative work will appear here.</p>
                    </div>
                  ) : (
                    savedDesigns.map(design => (
                      <div 
                        key={design.id} 
                        className="relative group cursor-pointer border border-slate-800 rounded-[2rem] overflow-hidden bg-slate-900/50 hover:border-primary/50 transition-all hover:-translate-y-2 shadow-xl" 
                        onClick={() => loadDesign(design)}
                      >
                        <img src={design.preview} alt="Saved design" className="w-full h-auto aspect-video object-cover" />
                        <div className="absolute inset-0 bg-slate-950/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
                          <span className="text-white font-display font-black uppercase tracking-wider text-sm mb-2 leading-tight">{design.name || 'Untitled Design'}</span>
                          <div className="flex items-center gap-2 mb-6">
                            <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">{new Date(design.timestamp).toLocaleDateString()}</span>
                            {design.id.startsWith('local_') && (
                              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[8px] font-black uppercase rounded tracking-tighter border border-slate-700">Local</span>
                            )}
                          </div>
                          <button className="px-6 py-3 bg-primary text-black font-display font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl shadow-primary/20 active:scale-95">Load Design</button>
                        </div>
                        <button 
                          onClick={(e) => deleteSavedDesign(design.id, e)} 
                          className="absolute top-4 right-4 p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20 shadow-xl"
                          title="Delete saved design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
